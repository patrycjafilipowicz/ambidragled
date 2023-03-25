import "./App.css";
import React, { useState } from "react";

function App() {
	const [leds, setLeds] = useState(["led"]);

	const mappedAddElement = leds.map((element, index) => {
		return <div className='led'>{element}</div>;
	});

	return (
		<div>
			<div className='screen'>
				<div>{mappedAddElement}</div>
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
