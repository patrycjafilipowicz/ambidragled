import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
	const [leds, setLeds] = useState(["led"]);
	const [coords, setCoords] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleWindowMouseMove = event => {
			setCoords({
				x: event.clientX,
				y: event.clientY,
			});
		};
		window.addEventListener("mousemove", handleWindowMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleWindowMouseMove);
		};
	}, []);

	const mappedAddElement = leds.map((element, index) => {
		return <div className='led'>{element}</div>;
	});

	return (
		<div>
			<div className='screen'>
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
