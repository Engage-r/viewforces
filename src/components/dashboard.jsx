import React, {useState, useEffect,useRef} from "react";
import axios from 'axios';

import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

import {styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import UserRatings from "./userRatings";
import UserTags from "./userTags";
import ContestStats from "./contestsStats";
import ProblemStats from "./problemStatsTable";
import ProblemRatings from "./problemRatings";

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'teal',
    },
    '&:hover fieldset': {
      borderColor: 'teal',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'teal',
    },
  },
});


const Dashboard = () => {
  const valueRef = useRef('');
  const [userStatusData, setUserStatusData] = useState({});
  const [userRatingsData, setUserRatingsData] = useState({});
  const [codeForcesId, setCodeForcesId] = useState('');
  const [formState, setFormState] = useState('IN_PROGRESS');
  const [userRatingsState, setUserRatingsState] = useState('IN_PROGRESS');

  useEffect(() => {
    if (formState === 'FETCHING_DATA') {
      axios.get(
        `https://codeforces.com/api/user.status?handle=${codeForcesId}`
      ).then(res => {
        const data = res.data.result;
        if (data.length) {
          setFormState('DONE');
        } else {
          setFormState('NO_DATA_FOUND');
        }
        setUserStatusData(data);
      }).catch(error => {
        setFormState('ERROR');
        console.log(error);
      });
    }
  }, [formState]);


  useEffect(() => {
    if (userRatingsState === 'FETCHING_DATA') {
      axios.get(
        `https://codeforces.com/api/user.rating?handle=${codeForcesId}`
      ).then(res => {
        const data = res.data.result;
        if (data.length) {
          setUserRatingsState('DONE');
        } else {
          setUserRatingsState('NO_DATA_FOUND');
        }
        setUserRatingsData(data);
      }).catch(error => {
        setUserRatingsState('ERROR');
        console.log(error);
      });
    }
  }, [userRatingsState]);


  const handleSubmission = () => {
    setCodeForcesId(valueRef.current.value);
    if (codeForcesId) {
      setFormState('FETCHING_DATA');
      setUserRatingsState('FETCHING_DATA')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCodeForcesId(valueRef.current.value);
      setFormState('FETCHING_DATA');
      setUserRatingsState('FETCHING_DATA');
    } else {
      setCodeForcesId(valueRef.current.value);
    }
  }

  if (formState === 'IN_PROGRESS') {
    return (
      <Box
        component="form"
        sx={{
          '& > :not(style)': {m: 1, width: '25ch'},
        }}
        className="codeforces-id-input"
      >
        <CssTextField
          InputLabelProps={{style : {color : 'grey'} }}
          InputProps={{style: {color: "white"}}}
          id="codeforces-id"
          label="Codeforces ID"
          onKeyDown={handleKeyDown}
          inputRef={valueRef}
        />
        <Button
          onClick={handleSubmission}
          variant="contained"
          style={{width: "32ch"}}
        >
          Submit
        </Button>
      </Box>
    );
  } else if (formState === 'FETCHING_DATA' || userRatingsState === 'FETCHING_DATA') {
    return (
      <div className="codeforces-id-input">
        <Typography variant="h5" component="div" color="white" gutterBottom>
          Loading data for {codeForcesId}
        </Typography>
        <Box sx={{ width: '50%'}}>
          <LinearProgress />
        </Box> 
      </div>
    );
  } else if (
    formState === 'NO_DATA_FOUND' || formState === 'ERROR' || userStatusData === 'NO_DATA_FOUND' || userRatingsState === 'ERROR'
  ) {
    return (
      <div className="codeforces-id-input">
        <Typography variant="h5" gutterBottom color="error" component="div">
          {
            formState === 'NO_DATA_FOUND' || userRatingsState === 'NO_DATA_FOUND' ? (
              `No data found for user: ${codeForcesId}`
            ) : 'Somethings went wrong please try again!'
          }
        </Typography>
        <Button
          onClick={() => setFormState('IN_PROGRESS')}
          variant="contained"
          style={{width: "32ch"}}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Box sx={{flexGrow: 1, height: "100vh", overflow: "hidden"}}>
      <Grid container rowSpacing={5} columnSpacing={2}>
        <Grid item xs={6}>
          <ProblemRatings dataset={userStatusData}/>
        </Grid>
        <Grid item xs={6}>
          <UserRatings ratingsData={userRatingsData} />
        </Grid>
        <Grid item xs={5}>
          <UserTags dataset={userStatusData}/>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ContestStats ratingsData={userRatingsData} handle={codeForcesId}/>
            </Grid>
            <Grid item xs={6}>
              <ProblemStats dataset={userStatusData} handle={codeForcesId}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
};

export default Dashboard;
