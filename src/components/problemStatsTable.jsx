import React, {useEffect, useState} from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {getUrl} from "../utils/helper";


const ProblemStats = ({dataset, handle}) => {
  const [stats, setStats] = useState({});
  const [isCalculating, setIsCalculating] = useState(true);

  const calculateStats = () => {
    let problems = {};

    for (let i = dataset.length - 1; i >= 0; i--) {
      let sub = dataset[i];
      let rating = sub.problem.rating === undefined ? 0 : sub.problem.rating;
      let problemId = sub.problem.contestId + '-' + sub.problem.name + '-' + rating;

      // checking if problem previously visited
      if (problems[problemId] !== undefined) {
        if (problems[problemId].solved === 0) {
          problems[problemId].attempts++;
        }
      } else {
        problems[problemId] = {
          problemLink: sub.contestId + '-' + sub.problem.index,
          attempts: 1,
          solved: 0
        };
      }

      if (sub.verdict === 'OK') {
        problems[problemId].solved++;
      }
    }
    //parse all the solved problems and extract some numbers about the solved problems
    let result = {
      tried: 0, solved: 0, maxAttempt: 0, maxAttemptProblem: '', maxAc: '', maxAcProblem: '', solvedWithOneSub: 0,
    }

    for (let p in problems) {
      result.tried++;
      if (problems[p].solved > 0) {
        result.solved++;
      }

      if (problems[p].attempts > result.maxAttempt) {
        result.maxAttempt = problems[p].attempts;
        result.maxAttemptProblem = problems[p].problemLink;
      }

      if (problems[p].solved > result.maxAc) {
        result.maxAc = problems[p].solved;
        result.maxAcProblem = problems[p].problemLink;
      }

      if (problems[p].solved > 0 && problems[p].attempts === 1) {
        result.solvedWithOneSub++;
      }
    }

    setStats(result);
  }

  useEffect(() => {
    if (isCalculating) {
      calculateStats();
      setIsCalculating(false);
    }
  }, [isCalculating]);

  if (Object.keys(stats).length === 0) {
    return null
  } else {
    return (
      <TableContainer>
        <Table>
          <TableHead style={{backgroundColor: "#0680ef"}}>
            <TableRow>
              <TableCell>Problem data of {handle}</TableCell>
              <TableCell align="right">{''}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{backgroundColor:"#ede2ce"}}>
            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell>
                Attempted
              </TableCell>
              <TableCell align="right">{stats.tried}</TableCell>
            </TableRow>
            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell>
                Accepted
              </TableCell>
              <TableCell align="right">{stats.solved}</TableCell>
            </TableRow>
            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell>
                Average attempts
              </TableCell>
              <TableCell align="right">{(dataset.length / stats.solved).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell>
                Max attempts
              </TableCell>
              <TableCell align="right">
                {stats.maxAttempt}
                <a style={{marginLeft: 5}} href={getUrl(stats.maxAttemptProblem)}>{`(${stats.maxAttemptProblem})`}</a>
              </TableCell>
            </TableRow>
            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell>
                Solved with a single attempt
              </TableCell>
              <TableCell
                align="right">{stats.solvedWithOneSub}</TableCell>
            </TableRow>
            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell>
                Max AC(s)
              </TableCell>
              <TableCell align="right">
                {stats.maxAc}
                <a style={{marginLeft: 5}} href={getUrl(stats.maxAcProblem)}>{`(${stats.maxAcProblem})`}</a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default ProblemStats;
