import './App.css';
import _ from 'lodash';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { ButtonGroup, Grid, Card, CardMedia, Button, Divider, Alert, Snackbar, Typography } from '@mui/material'
import ukraine from './geojson/index.json';
import Background from './Background';

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

const background = require(`./assets/bg${_.random(1, 7)}.jpg`)
function App() {
  const imgSize = 300;
  const [questionsCount, setQuestionsCount] = useState(-1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [question, setQuestion] = useState({})
  const [snack, setSnack] = useState({
    shown: false,
    correct: false
  });

  useEffect(() => {
    const question = randomQuestion();
    setQuestion(question);
    setQuestionsCount(prev => prev + 1);
  }, [correctAnswers, incorrectAnswers]);

  useEffect(() => {
    if (!question || !question.geojson) {
      return;
    }

    var projection = d3.geoMercator();
    var path = d3.geoPath().projection(projection);
    projection.fitSize([imgSize, imgSize], question.geojson);

    const svg = d3.select('#subject');
    svg.selectAll('path').remove();

    svg
      .append('path')
      .attr('d', d => path(question.geojson))
      .attr('stroke', '#1F80DB')
      .attr('stroke-width', 4)
      .attr('fill', '#fff');
  }, [question])

  const handleOptionClick = option => () => {
    const correct = option === question.answer;

    setSnack({
      shown: true,
      correct,
    });

    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  }

  const handleSnackClose = () => setSnack({
    ...snack,
    shown: false,
  });

  return (
    <div>
      <Background src={background}/>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs="auto">
          <Card 
           align="center"
           style={{ padding: 20, borderRadius: 7 }} 
           raised>
            <CardMedia style={{ padding: '20px 0' }}>
              <svg id="subject" width={imgSize} height={imgSize} />
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
              Guessed: {`${correctAnswers}/${questionsCount}`}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={snack.shown} autoHideDuration={1000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snack.correct ? 'success' : 'error'} sx={{ width: '100%' }}>
          {snack.correct ? 'Correct!' : 'Wrong!'}
        </Alert>
      </Snackbar>

    </div>
  );
}

export default App;