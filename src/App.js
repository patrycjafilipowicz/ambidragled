import "./App.css";
import React, { useState, useEffect, useRef } from "react";

function App() {
	const [leds, setLeds] = useState([{ x: 33, y: 25 }]);
	// Coordinates are relative to parent box top left corner
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [pickedLedIndex, setPickedLedIndex] = useState(null);
	const screen = useRef();

	useEffect(() => {
		const screenRef = screen.current;
		const position = screenRef.getBoundingClientRect();
		const handleWindowMouseMove = event => {
			console.log(event);
			const xAvailableSpace =
				event.pageX > position.left && event.pageX < position.right;
			const yAvailableSpace =
				event.pageY > position.top && event.pageY < position.bottom;
			if (xAvailableSpace && yAvailableSpace) {
				setMousePosition({
					x: event.pageX - position.left,
					y: event.pageY - position.top,
				});
			}
		};
		screenRef.addEventListener("mousemove", handleWindowMouseMove);

		return () => {
			screenRef.removeEventListener("mousemove", handleWindowMouseMove);
		};
	}, [screen]);

	const mappedAddElement = leds.map((element, index) => {
		return (
			<div
				style={
					pickedLedIndex === index
						? {
								position: "absolute",
								left: `${mousePosition.x - 33}px`,
								top: `${mousePosition.y - 25}px`,
						  }
						: {
								position: "absolute",
								left: `${element.x - 33}px`,
								top: `${element.y - 25}px`,
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
					setLeds(leds => [...leds, { x: 33, y: 25 }]);
				}}>
				Add led
			</button>
		</div>
	);
}

export default App;
