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
	const [leds, setLeds] = useState([{x: initialX, y: initialY }]);
	// Coordinates are relative to parent box top left corner
	const [mousePosition, setMousePosition] = useState({ x: zero, y: zero });
	const [pickedLedIndex, setPickedLedIndex] = useState(null);
	const screen = useRef();

	useEffect(() => {
		const screenRef = screen.current;
		const position = screenRef.getBoundingClientRect();
		const handleWindowMouseMove = event => {
			console.log(event);
			const xAvailableSpace =
				event.pageX >= (position.left + border + initialY) && event.pageX <= (position.right - border- initialY);
			const yAvailableSpace =
				event.pageY >= (position.top + border + halfLedHeight) && event.pageY <= (position.bottom - border -halfLedHeight);
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
		return (
			<div
				style={
					pickedLedIndex === index
						? {
								position: "absolute",
								left: `${mousePosition.x - initialX}px`,
								top: `${mousePosition.y - initialY}px`,
						  }
						: {
								position: "absolute",
								left: `${element.x - initialX}px`,
								top: `${element.y - initialY}px`,
						  }
				}
				className='led'
				onClick={() => {
					setPickedLedIndex(index);
					const isCurrentLedPicked = index === pickedLedIndex;
					if (isCurrentLedPicked) {
						setLeds(elements =>
							elements.map((e, i) => (i === index ? mousePosition : e))
						);
						setPickedLedIndex(null);
					}
				}}>
				{Math.round(element.x)},{Math.round(element.y)}
			</div>
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

export default App;
