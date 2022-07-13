import React, {useEffect, useState} from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const ContestStats = ({ratingsData, handle}) => {
  const [stats, setStats] = useState({});
  const [isCalculating, setIsCalculating] = useState(true);

  const contestUrl = 'https://codeforces.com/contest/';

  const calculateState = () => {
    let result = {
      best: 1e10, bestContest: '', worst: -1e10, worstContest: '', maxUp: 0, maxUpContest: '', maxDown: 0, maxDownContest: '',maxRating:0,
    }
    ratingsData.forEach(function (contest) {
      if (contest.rank < result.best) {
        result.best = contest.rank;
        result.bestContest = contest.contestId;
      }
      if (contest.rank > result.worst) {
        result.worst = contest.rank;
        result.worstContest = contest.contestId;
      }
      if(contest.newRating>result.maxRating){
        result.maxRating=contest.newRating;
      }

      let ch = contest.newRating - contest.oldRating;
      if (ch > result.maxUp) {
        result.maxUp = ch;
        result.maxUpContest = contest.contestId;
      }
      if (ch < result.maxDown) {
        result.maxDown = ch;
        result.maxDownContest = contest.contestId;
      }
    });

    setStats(result);
  }

  useEffect(() => {
    if (isCalculating) {
      calculateState();
      setIsCalculating(false);
    }
  }, [isCalculating]);

  return (
    <TableContainer>
      <Table>
        <TableHead style={{backgroundColor: "#0680ef"}}>
          <TableRow>
            <TableCell align="left">Contests data of {handle}</TableCell>
            <TableCell align="right">{''}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{backgroundColor:"#ede2ce"}}>
          <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell>
              Number of contests
            </TableCell>
            <TableCell align="right">{ratingsData.length}</TableCell>
          </TableRow>
          <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell>
              Best Rank
            </TableCell>
            <TableCell align="right">
              {stats.best}
               <a style={{marginLeft: 5}} href={contestUrl + stats.bestContest}>{`(${stats.bestContest})`}</a>
            </TableCell>
          </TableRow>
          <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell>
              Worst Rank
            </TableCell>
            <TableCell align="right">
              {stats.worst}
              <a style={{marginLeft: 5}} href={contestUrl + stats.worstContest}>{`(${stats.worstContest})`}</a>
            </TableCell>
          </TableRow>
          <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell>
              Max up
            </TableCell>
            <TableCell align="right">
              {stats.maxUp}
              <a style={{marginLeft: 5}} href={contestUrl + stats.maxUpContest}>{`(${stats.maxUpContest})`}</a>
            </TableCell>
          </TableRow>
          <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell>
              Max down
            </TableCell>
            <TableCell align="right">
              {stats.maxDown}
              <a style={{marginLeft: 5}} href={contestUrl + stats.maxDownContest}>{`(${stats.maxDownContest})`}</a>
            </TableCell>
          </TableRow>
          <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell>
              Max Rating
            </TableCell>
            <TableCell align="right">{stats.maxRating}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ContestStats;
