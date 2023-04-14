import "./App.css";
import React, { useState, useEffect, useRef } from "react";
const ledHeight = 30;
const ledWidth = 50;
const border = 10;
const initialX = 33;
const initialY = 25;
const mousemove = "mousemove";
const zero = 0;
const halfLedWidth = 25;
const halfLedHeight = 15;

function App() {
	const [leds, setLeds] = useState([
		{ x: initialX, y: initialY, height: ledHeight, width: ledWidth },
	]);
	// Coordinates are relative to parent box top left corner
	const [mousePosition, setMousePosition] = useState({ x: zero, y: zero });
	const [pickedLedIndex, setPickedLedIndex] = useState(null);
	const screen = useRef();
	const [initialHandlePosition, setInitialHandlePosition] = useState(null);
	const [resizedLedIndex, setResizedLedIndex] = useState(null);
	const [resizedLedindexRight, setResizedLedindexRight] = useState(null);
	const [resizedLedIndexLeft, setResizedLedIndexLeft] = useState(null);

	useEffect(() => {
		const screenRef = screen.current;
		const position = screenRef.getBoundingClientRect();
		const handleWindowMouseMove = event => {
			console.log(event);
			const xAvailableSpace =
				event.pageX >= position.left + border + initialY &&
				event.pageX <= position.right - border - initialY;
			const yAvailableSpace =
				event.pageY >= position.top + border + halfLedHeight &&
				event.pageY <= position.bottom - border - halfLedHeight;
			if (xAvailableSpace && yAvailableSpace) {
				setMousePosition({
					x: event.pageX - position.left,
					y: event.pageY - position.top,
				});
			}
		};
		screenRef.addEventListener(mousemove, handleWindowMouseMove);

		return () => {
			screenRef.removeEventListener(mousemove, handleWindowMouseMove);
		};
	}, [screen]);

	const mappedAddElement = leds.map((element, index) => {
		const ledPositionLeft =
			resizedLedIndexLeft === index
				? `${mousePosition.x - 8}px`
				: pickedLedIndex === index
				? `${mousePosition.x - initialX}px`
				: `${element.x - initialX}px`;

		return (
			<Led
				isSelected={pickedLedIndex === index}
				left={ledPositionLeft}
				top={
					pickedLedIndex === index
						? `${mousePosition.y - initialY}px`
						: `${element.y - initialY}px`
				}
				height={
					resizedLedIndex === index
						? mousePosition.y - element.y + 14
						: element.height
				}
				width={
					resizedLedindexRight === index
						? mousePosition.x - element.x + 25
						: element.width
				}
				onSelect={() => {
					const isCurrentLedPicked = index === pickedLedIndex;
					if (isCurrentLedPicked) {
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? { ...e, x: mousePosition.x, y: mousePosition.y }
									: e
							)
						);
						setPickedLedIndex(null);
					} else {
						setPickedLedIndex(index);
					}
				}}
				onStartResizeDown={() => {
					const isCurrentLedResized = index === resizedLedIndex;
					if (isCurrentLedResized) {
						setResizedLedIndex(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? { ...e, height: mousePosition.y - element.y + 14 }
									: e
							)
						);
					} else {
						setResizedLedIndex(index);
					}
					setInitialHandlePosition(mousePosition.y);
				}}
				onStartResizeRight={() => {
					const isCurrentLedResizedRight = index === resizedLedindexRight;
					if (isCurrentLedResizedRight) {
						setResizedLedindexRight(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? { ...e, width: mousePosition.x - element.x + 25 }
									: e
							)
						);
					} else {
						setResizedLedindexRight(index);
					}
				}}
				onStartResizeLeft={() => {
					const isCurrentLedResizedLeft = index === resizedLedIndexLeft;
					if (isCurrentLedResizedLeft) {
						setResizedLedIndexLeft(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? { ...e, x: mousePosition.x, y: mousePosition.y, width: mousePosition.x - element.x + 25}
									: e
							)
						);
					} else {
						setResizedLedIndexLeft(index);
					}
				}}>
				{Math.round(element.x)},{Math.round(element.y)}
			</Led>
		);
	});

	return (
		<div>
			<div ref={screen} className='screen'>
				<div>{mappedAddElement}</div>
			</div>
			<div className='coords'>
				<p>
					Mouse positioned at:{" "}
					<b>
						({Math.round(mousePosition.x)}, {Math.round(mousePosition.y)})
					</b>
				</p>
			</div>
			<button
				onClick={() => {
					setLeds(leds => [...leds, { x: initialX, y: initialY }]);
				}}>
				Add led
			</button>
		</div>
	);
}

function Led({
	children,
	onSelect,
	left,
	top,
	isSelected,
	onStartResizeDown,
	onStartResizeRight,
	onStartResizeLeft,
	height,
	width,
}) {
	return (
		<div
			className='led'
			onClick={onSelect}
			style={{
				left: left,
				height: height,
				width: width,
				top: top,
				position: "absolute",
				border: isSelected ? "1.5px white solid" : " ",
			}}>
			<div
				className='handle'
				style={{
					position: "absolute",
					left: "calc(50% - 2.5px)",
					top: -2.5,
					backgroundColor: "white",
					width: 5,
					height: 5,
				}}></div>
			<div
				onClick={event => {
					onStartResizeDown();
					event.stopPropagation();
				}}
				className='handle'
				style={{
					position: "absolute",
					left: "calc(50% - 2.5px)",
					bottom: -2.5,
					backgroundColor: "white",
					width: 5,
					height: 5,
				}}></div>
			<div
				onClick={event => {
					onStartResizeLeft();
					event.stopPropagation();
				}}
				className='handle'
				style={{
					position: "absolute",
					left: -2.5,
					top: "calc(50% - 2.5px)",
					backgroundColor: "white",
					width: 5,
					height: 5,
				}}></div>
			<div
				onClick={event => {
					onStartResizeRight();
					event.stopPropagation();
				}}
				className='handle'
				style={{
					position: "absolute",
					right: -2.5,
					top: "calc(50% - 2.5px)",
					backgroundColor: "white",
					width: 5,
					height: 5,
				}}></div>
			{children}
		</div>
	);
}

export default App;
