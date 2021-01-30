import axios from 'axios';
import listStats from './listStats';

export default async function onSubmitResults(dispatch, completedList, setStatList, setSubmitted, setResultsPending) {
	dispatch(setResultsPending(true));
	let stat = await listStats(completedList);
	if (process.env.REACT_APP_TESTING_ENV) {
		//TESTING POST
		stat._id += "TEST";
		await axios.post('http://localhost:5000/stats/update/'+stat._id, stat)
		.then(res => {
			console.log('Testing stats updated!');
			dispatch(setStatList(res.data));
			dispatch(setSubmitted(true));
			dispatch(setResultsPending(false));
		})
		.catch(async (err) => {
			console.log('Could not find existing table, attempting to create new table!')
			//TESTING ADD
			await axios.post('http://localhost:5000/stats/add/', stat)
			.then(res => {
				dispatch(setSubmitted(true));
				dispatch(setResultsPending(false));
				console.log('Table added!');
			})
			.catch((err) => {
				dispatch(setResultsPending(false));
			});
		});
	}
	else {
		//PRODUCTION POST
		axios.post('/stats/update/'+stat._id, stat)
			.then(res => {
				console.log('Stats updated!');
				dispatch(setStatList(res.data));
				dispatch(setSubmitted(true));
				dispatch(setResultsPending(false));
			})
			.catch((err) => {
				dispatch(setResultsPending(false));
			});
	}
}