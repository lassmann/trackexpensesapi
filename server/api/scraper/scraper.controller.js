'use strict';

const scrapeIt = require('scrape-it');
const cheerio = require('cheerio');
const request = require('request');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Expenses
// export function ranking(req, res) {
//   const type = req.params.type;
//   const language = req.params.language;
//   const place = req.params.place;
//
//   //http://git-awards.com/users?utf8=%E2%9C%93&type=city&language=javascript&city=resistencia
//   //http://git-awards.com/users?utf8=%E2%9C%93&type=country&language=javascript&country=United+states
//   //http://git-awards.com/users?utf8=%E2%9C%93&type=world&language=php
//
//   scrapeIt(`http://git-awards.com/users?utf8=%E2%9C%93&type=city&language=javascript&city=resistencia`, {
//     title: 'h1',
//     users: {
//       listItem: 'tr',
//       data: {
//         avatar: {
//           selector: 'a img',
//           attr: 'src'
//         },
//         username: 'td a',
//         rank: 'td:nth-child(3)',
//         stars: 'td:nth-child(4)'
//       }
//     }
//   })
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

function scrape(url) {
  return scrapeIt(url, {
    title: 'h1',
    users: {
      listItem: 'tr',
      data: {
        avatar: {
          selector: 'a img',
          attr: 'src'
        },
        username: 'td a',
        rank: 'td:nth-child(3)',
        stars: 'td:nth-child(4)'
      }
    }
  });
}


export function cityRanking(req, res) {
  const city = req.params.city;
  const language = req.params.language;
  const url = `http://git-awards.com/users?utf8=%E2%9C%93&type=city&language=${language}&city=${city}`;
  scrape(url)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function countryRanking(req, res) {
  const country = req.params.country;
  const language = req.params.language;
  const url = `http://git-awards.com/users?utf8=%E2%9C%93&type=country&language=${language}&country=${country}`;
  scrape(url)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function worldRanking(req, res) {
  const language = req.params.language;
  const url = `http://git-awards.com/users?utf8=%E2%9C%93&type=world&language=${language}`;
  scrape(url)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function userRanking(req, res) {
  const username = req.params.username;
  request(`http://git-awards.com/users/search?login=${username}`, (err, resp, html) => {
    const json = {};
    if(!err) {
      var $ = cheerio.load(html);
      const country = $('.col-md-3.info').children('.row').children('p').first().next().text()
      json.username = username;
      json.avatar = $('img.thumbnail.avatar-bg').attr('src');
      json.city = $('.col-md-3.info').children('.row').children('p').first().text();
      json.country = country;
      const rankings = [];
      $('.col-md-9').each(function(i, elem) {
        if(i === 0) {
          $(this).children().each(function(i, elem) {
            if($(this).html().length) {
              const rank = {};
              const language = $(this).find('p').first().text().replace('ranking', '').trim();
              rank[language] = {
                worldwide: $(this).find('tbody').children().first().next().next().children().last().text().trim(),
                repos: $(this).find('tbody').children().last().prev().children().last().text().trim(),
                stars: $(this).find('tbody').children().last().children().last().text().trim()
              };
              if(language && country) {
                rank[language][country] = $(this).find('tbody').children().first().next().children().last().text().trim();
              }
              rankings.push(rank);
            }
          });
        }
      });
      json.rankings = rankings;
      return res.json(json);
    }
  });
}
