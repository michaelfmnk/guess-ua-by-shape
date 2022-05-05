/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import _ from 'lodash';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { ButtonGroup, Card, CardMedia, Button, Divider, Alert, Snackbar, Typography } from '@mui/material'
import ukraine from './geojson/index.json';

const randomQuestion = () => {
  const oblast = _.sample(ukraine.features);
  const answer = oblast.properties.name_1;
  const options = _.shuffle([
    answer,
    ..._.sampleSize(
      ukraine.features.map(f => f.properties.name_1).filter(f => f !== answer),
      3
    )
  ]);

  return {
    geojson: oblast,
    answer,
    options
  };
}

function App() {
  const [questionNum, setQuestionNum] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTry, setFirstTry] = useState(true);
  const [question, setQuestion] = useState({})
  const [snack, setSnack] = useState({
    shown: false,
    correct: false
  });

  useEffect(() => {
    // reset state
    setFirstTry(true);

    const question = randomQuestion();
    setQuestion(question);
  }, [questionNum]);

  useEffect(() => {
    if (!question || !question.geojson) {
      return;
    }
    var projection = d3.geoMercator();
    var path = d3.geoPath().projection(projection);
    projection.fitSize([300, 300], question.geojson);
    console.log(question.answer)

    const svg = d3.select('#subject');
    svg.selectAll('path').remove();
    svg
      .append('path')
      .attr('d', d => path(question.geojson))
      .attr('fill', '#1F80DB')
      .attr('stroke', 'white')


  }, [question])

  const handleOptionClick = option => () => {
    const correct = option === question.answer;
    setSnack({
      shown: true,
      correct,
    });

    if (correct) {
      setQuestionNum(questionNum + 1);
      setCorrectCount(correctCount + (firstTry ? 1 : 0))
    }
    setFirstTry(false);
  }

  const handleSnackClose = () => {
    setSnack({
      ...snack,
      shown: false,
    });
  }

  return (
    <div className="App">
      <Card sx={{ maxWidth: 500 }} className="center" style={{ padding: 20, borderRadius: 7 }} raised>
        <CardMedia style={{ padding: '20px 0' }}>
          <svg id="subject" width={350} height={350} />
        </CardMedia>
        <Divider />
        <ButtonGroup
          disabled={snack.shown}
          style={{ margin: '20px 0' }}
          orientation="vertical">
          {
            question && question.options && question.options.map(option => (
              <Button key={option} onClick={handleOptionClick(option)}>
                {option}
              </Button>
            ))
          }
        </ButtonGroup>
        <Divider style={{ marginBottom: 20 }} />
        <Typography variant='h6'>
          Guessed: {correctCount} / {questionNum}
        </Typography>
      </Card>
      <Snackbar open={snack.shown} autoHideDuration={1000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snack.correct ? 'success' : 'error'} sx={{ width: '100%' }}>
          {snack.correct ? 'Correct!' : 'Wrong!'}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;