import "./App.css";
import React, { useState, useEffect, useRef } from "react";

function App() {
	const [leds, setLeds] = useState(["led"]);
	const [coords, setCoords] = useState({ x: 0, y: 0 });
	const [pressedElementIndex, setPressedElementIndex] = useState(null);
	const screen = useRef();

	useEffect(() => {
		const screenRef = screen.current;
		const position = screenRef.getBoundingClientRect();
		const handleWindowMouseMove = event => {
			console.log(event);
			setCoords({
				x: event.pageX - position.left,
				y: event.pageY - position.top,
			});
		};
		screenRef.addEventListener("mousemove", handleWindowMouseMove);

		return () => {
			screenRef.removeEventListener("mousemove", handleWindowMouseMove);
		};
	}, [screen]);

	const mappedAddElement = leds.map((element, index) => {
		return (
			<div
				style={{
					position: "absolute",
					left: `${coords.x}px`,
					top: `${coords.y}px`,
				}}
				className='led'
				onClick={() => {
					setPressedElementIndex(index);
				}}>
				{element}
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
						({coords.x}, {coords.y})
					</b>
				</p>
			</div>
			<button
				onClick={() => {
					setLeds(leds => [...leds, "led"]);
				}}>
				Add led
			</button>
		</div>
	);
}

export default App;
