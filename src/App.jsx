import {
	Box,
	Slider,
	Grid,
	Typography,
	TextField,
	Button,
	Modal,
	CircularProgress,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { markerLocation, radiChange, compare } from "../main";
import { useState } from "react";

// function loadingOff() {
// 	setLoading(false);
// }

function App() {
	const [open, setOpen] = useState(false);
	// const [loading, setLoading] = useState(false);
	function handleClose() {
		setOpen(false);
	}
	function compareClick() {
		compare();
		setOpen(true);
		// setLoading(true);
	}
	function ownLocation(id) {
		const getLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else {
				console.error("Geolocation is not supported by this browser");
			}
		};
		const showPosition = (position) => {
			const userLocationX = position.coords.latitude;
			const userLocationY = position.coords.longitude;
			console.log(userLocationX);
			console.log(userLocationY);
			document.getElementById(
				`input${id}`
			).value = `${userLocationX}, ${userLocationY}`;
		};
		getLocation();
	}
	return (
		<>
			<Box
				sx={{
					marginTop: "2vh",
					marginLeft: "2vh",
					height: "86vh",
					width: "25vw",
					borderRadius: "24px",
					background:
						"radial-gradient(107.32% 141.42% at 0% 0%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.31) 99.99%, rgba(255, 255, 255, 0) 100%)",
					boxShadow:
						"4px 4px 40px 0px rgba(0, 0, 0, 0.36), -5px -5px 250px 0px rgba(255, 255, 255, 0.02) inset",
					backdropFilter: "blur(21px)",
					padding: "2rem",
				}}
			>
				<Typography variant="h6">Location 1</Typography>
				<TextField id="input1" fullWidth size="small" mt={2} />
				<Grid container gap={1} mt={1}>
					<Grid item>
						<Button
							size="small"
							variant="outlined"
							onClick={() => markerLocation(1)}
						>
							Choose on Map
						</Button>
					</Grid>
					<Grid item>
						<Button
							size="small"
							variant="contained"
							onClick={() => ownLocation(1)}
							startIcon={<MyLocationIcon />}
						>
							My Location
						</Button>
					</Grid>
				</Grid>
				<Typography variant="h6" mt={3}>
					Location 2
				</Typography>
				<TextField id="input2" fullWidth size="small" mt={2} />
				<Grid container gap={1} mt={1}>
					<Grid item>
						<Button
							size="small"
							variant="outlined"
							onClick={() => markerLocation(2)}
						>
							Choose on Map
						</Button>
					</Grid>
					<Grid item>
						<Button
							size="small"
							variant="contained"
							onClick={() => ownLocation(2)}
							startIcon={<MyLocationIcon />}
						>
							My Location
						</Button>
					</Grid>
				</Grid>
				<Typography variant="h6" mt={2}>
					Radius
				</Typography>
				<Slider
					onChangeCommitted={(e, value) => radiChange(value)}
					defaultValue={300}
					getAriaValueText={(value) => `${value}m`}
					valueLabelDisplay="auto"
					step={50}
					marks
					min={50}
					max={1000}
				/>
				<Button fullWidth mt="auto" variant="contained" onClick={compareClick}>
					Compare
				</Button>
			</Box>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box
					sx={{
						display: "grid",
						placeItems: "center",
						bgcolor: "white",
						borderRadius: "24px",
						padding: "2rem",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "50vw",
						height: "50vh",
						boxShadow:
							"4px 4px 40px 0px rgba(0, 0, 0, 0.36), -5px -5px 250px 0px rgba(255, 255, 255, 0.02) inset",
						backdropFilter: "blur(21px)",
					}}
				>
					{/* {loading && <CircularProgress />} */}
					<Typography variant="h4">
						<span id="result"></span>
					</Typography>
				</Box>
			</Modal>
		</>
	);
}

export default App;
// export { loadingOff };
