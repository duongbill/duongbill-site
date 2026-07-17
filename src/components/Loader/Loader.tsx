"use client";
import { Html } from "@react-three/drei";
import React from "react";

const CanvasLoader = () => {
	return (
		<Html
			as="div"
			center
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<span className="canvas-loader" />
			<p
				style={{
					fontSize: 14,
					color: "#93c5fd",
					fontWeight: 600,
					marginTop: 12,
					letterSpacing: "1px",
					textTransform: "uppercase",
				}}
			>
				Loading 3D Scene...
			</p>
		</Html>
	);
};

export default CanvasLoader;
