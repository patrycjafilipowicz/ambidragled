import "./App.css";
import React, { useState, useEffect, useRef } from "react";
const ledHeight = 30;
const ledWidth = 50;
const border = 10;
const initialX = 33;
const initialY = 25;
const mousemove = "mousemove";
const zero = 0;
const halfLedHeight = 15;

function App() {
	const [leds, setLeds] = useState([
		{ x: initialX, y: initialY, height: ledHeight, width: ledWidth },]);
	// Coordinates are relative to parent box top left corner
	const [mousePosition, setMousePosition] = useState({ x: zero, y: zero });
	const [pickedLedIndex, setPickedLedIndex] = useState(null);
	const screen = useRef();

	const [resizedDownLedIndex, setResizedLedIndex] = useState(null);
	const [resizedRightLedindex, setResizedLedindexRight] = useState(null);
	const [resizedLeftLedIndex, setResizedLedIndexLeft] = useState(null);
	const [resizedUpLedIndex, setResizedLedIndexUp] = useState(null);
	const [screenDimensions, setScreenDimensions] = useState({ height: zero, width: zero });

	useEffect(() => {
		const screenRef = screen.current;
		const handleWindowMouseMove = event => {
			const screenRect = screenRef.getBoundingClientRect();
			const xInsideScreenArea =
				event.pageX >= screenRect.left + border &&
				event.pageX <= screenRect.right - border;
			const yInsideScreenArea =
				event.pageY >= screenRect.top + border &&
				event.pageY <= screenRect.bottom - border;
			if (xInsideScreenArea && yInsideScreenArea) {
				setMousePosition({
					x: event.pageX - screenRect.left,
					y: event.pageY - screenRect.top,
				});
				setScreenDimensions({
					height: screenRect.height,
					width: screenRect.width,
				});
			}
		};
		screenRef.addEventListener(mousemove, handleWindowMouseMove);

		return () => {
			screenRef.removeEventListener(mousemove, handleWindowMouseMove);
		};
	}, [screen]);

	const ledComponents = leds.map((led, index) => {
		const isLedPicked = pickedLedIndex === index;
		const isLedResizedLeft = resizedLeftLedIndex === index;
		const isLedResizedUp = resizedUpLedIndex === index;
		const isLedResizedRight = resizedRightLedindex === index;
		const isLedResizedDown = resizedDownLedIndex === index;

		const ledWidth = isLedResizedLeft
			? led.x - mousePosition.x + led.width + border
			: isLedResizedRight
			? mousePosition.x - led.x - border
			: led.width;

		const ledHeight = isLedResizedUp
			? led.y - mousePosition.y + led.height + border
			: isLedResizedDown
			? mousePosition.y - led.y - border
			: led.height;

		const pickedLedPositionYDown =
			mousePosition.y <= screenDimensions.height - ledHeight
				? mousePosition.y - initialY
				: screenDimensions.height - border - ledHeight - halfLedHeight;

		const pickedLedPositionYUp =
			mousePosition.y <= initialY ? 0 : pickedLedPositionYDown;

		const ledPositionY = isLedResizedUp
			? mousePosition.y - border
			: isLedPicked
			? pickedLedPositionYUp
			: led.y;

		const ledPositionXLeft =
			mousePosition.x >= initialX ? mousePosition.x - initialX : 0;

		const pickedLedPositionXRight =
			mousePosition.x <= screenDimensions.width - ledWidth
				? ledPositionXLeft
				: screenDimensions.width - border - ledWidth - halfLedHeight;

		const ledPositionX = isLedResizedLeft
			? mousePosition.x - border
			: isLedPicked
			? pickedLedPositionXRight
			: led.x;
		console.log(ledPositionX);

		return (
			<Led
				isSelected={isLedPicked}
				left={ledPositionX}
				top={ledPositionY}
				height={ledHeight}
				width={ledWidth}
				isLedResizedDown={isLedResizedDown}
				isLedResizedLeft={isLedResizedLeft}
				isLedResizedUp={isLedResizedUp}
				isLedResizedRight={isLedResizedRight}
				onSelect={() => {
					if (isLedPicked) {
						setLeds(elements =>
							elements.map((e, i) =>
								i === index ? { ...e, x: ledPositionX, y: ledPositionY } : e
							)
						);
						setPickedLedIndex(null);
					} else {
						setPickedLedIndex(index);
					}
				}}
				onStartResizeDown={() => {
					const isCurrentLedResized = index === resizedDownLedIndex;
					if (isCurrentLedResized) {
						setResizedLedIndex(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? {
											...e,
											height: mousePosition.y - led.y - border,
									  }
									: e
							)
						);
					} else {
						setResizedLedIndex(index);
					}
				}}
				onStartResizeRight={() => {
					const isCurrentLedResizedRight = index === resizedRightLedindex;
					if (isCurrentLedResizedRight) {
						setResizedLedindexRight(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? { ...e, width: mousePosition.x - led.x - border }
									: e
							)
						);
					} else {
						setResizedLedindexRight(index);
					}
				}}
				onStartResizeLeft={() => {
					const isCurrentLedResizedLeft = index === resizedLeftLedIndex;
					if (isCurrentLedResizedLeft) {
						setResizedLedIndexLeft(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? {
											...e,
											x: mousePosition.x - border,
											width: ledWidth,
									  }
									: e
							)
						);
					} else {
						setResizedLedIndexLeft(index);
					}
				}}
				onStartResizeUp={() => {
					const isCurrentLedResizedUp = index === resizedUpLedIndex;
					if (isCurrentLedResizedUp) {
						setResizedLedIndexUp(null);
						setLeds(elements =>
							elements.map((e, i) =>
								i === index
									? {
											...e,
											y: mousePosition.y - border,
											height: ledHeight,
									  }
									: e
							)
						);
					} else {
						setResizedLedIndexUp(index);
					}
				}}>
				{Math.round(led.x)},{Math.round(led.y)}
			</Led>
		);
	});

	return (
		<div>
			<div ref={screen} className='screen'>
				<div>{ledComponents}</div>
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
					setLeds(leds => [...leds, { x: initialX, y: initialY, width: ledWidth, height: ledHeight }]);
				}}>
				Add led
			</button>
			<div>
				{JSON.stringify(
					{
						leds,
						mousePosition,
						pickedLedIndex,
						resizedLedIndex: resizedDownLedIndex,
						resizedLedindexRight: resizedRightLedindex,
						resizedLedIndexLeft: resizedLeftLedIndex,
						resizedLedIndexUp: resizedUpLedIndex,
					},
					undefined,
					"\n"
				)}
			</div>
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
	onStartResizeUp,
	height,
	width,
	isLedResizedDown,
	isLedResizedUp,
	isLedResizedRight,
	isLedResizedLeft,
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
				border: isSelected ? "2px #ffffff solid" : "1.5px #4C243B solid",
				backgroundColor: isSelected ? "#54457F" : "#B84A62",
				transition: "background-color 0.3s ease-in-out",
				opacity: "0.8",
			}}>
			<div
				onClick={event => {
					onStartResizeUp();
					event.stopPropagation();
				}}
				className='handle'
				style={{
					position: "absolute",
					left: "calc(50% - 2.5px)",
					top: -2.5,
					width: 5,
					height: 5,
					backgroundColor: isLedResizedUp ? "#BCB382" : "#ffffff",
					transition: "background-color 0.5s ease-in-out",

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
					width: 5,
					height: 5,
					backgroundColor: isLedResizedDown ? "#0d6146" : "#ffffff",
					transition: "background-color 0.5s ease-in-out",
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
					width: 5,
					height: 5,
					backgroundColor: isLedResizedLeft ? "#0d6146" : "#ffffff",
					transition: "background-color 0.5s ease-in-out",
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
					width: 5,
					height: 5,
					backgroundColor: isLedResizedRight ? "#0d6146" : "#ffffff",
					transition: "background-color 0.5s ease-in-out",
				}}></div>
			{children}
		</div>
	);
}

export default App;
