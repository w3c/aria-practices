/**
 * @fileOverview Generates "Lorem ipsum" style text.
 * @author rviscomi@gmail.com Rick Viscomi,
 *    tinsley@tinsology.net Mathew Tinsley
 * @version 1.0
 */

/**
 *  Copyright (c) 2009, Mathew Tinsley (tinsley@tinsology.net)
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the name of the organization nor the
 *      names of its contributors may be used to endorse or promote products
 *      derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY MATHEW TINSLEY ''AS IS'' AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @class Jibborish generator.
 */

'use strict';

var LoremIpsum = function () {
};

/**
 * Average number of words per sentence.
 * @constant {number}
 */
LoremIpsum.WORDS_PER_SENTENCE_AVG = 24.460;

/**
 * Standard deviation of the number of words per sentence.
 * @constant {number}
 */
LoremIpsum.WORDS_PER_SENTENCE_STD = 5.080;

/**
 * List of possible words.
 * @constant {Array.string}
 */
LoremIpsum.WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
    'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
    'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
    'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
    'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
    'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
    'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
    'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
    'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
    'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
    'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
    'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis',
    'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
    'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
    'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
    'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
    'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
    'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
    'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
    'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
    'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
    'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
    'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
    'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
    'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
    'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
    'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
    'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
    'elementum', 'tempor', 'risus', 'cras', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut',
    'labore', 'et', 'dolore', 'magna', 'aliqua', 'Neque', 'gravida', 'in',
    'fermentum', 'et', 'sollicitudin', 'Tellus', 'mauris', 'a', 'diam',
    'maecenas', 'sed', 'enim', 'felis', 'imperdiet', 'proin', 'fermentum',
    'leo', 'iaculis', 'eu', 'non', 'diam', 'phasellus', 'vestibulum', 'lorem',
    'sed', 'risus', 'ultricies', 'Eu', 'mi', 'bibendum', 'neque', 'egestas',
    'congue', 'mattis', 'aliquam', 'faucibus', 'purus', 'in', 'massa',
    'ultrices', 'dui', 'sapien', 'eget', 'mi', 'proin', 'sed', 'nulla', 'facilisi',
    'etiam', 'dignissim', 'diam', 'quis', 'enim', 'Pellentesque', 'elit',
    'ullamcorper', 'dignissim', 'cras', 'Tincidunt', 'augue', 'interdum', 'velit',
    'euismod', 'in', 'pellentesque', 'Vitae', 'tempus', 'quam', 'pellentesque',
    'nec', 'nam', 'Et', 'netus', 'et', 'malesuada', 'fames', 'ac', 'turpis',
    'egestas', 'maecenas', 'pharetra', 'Eget', 'mauris', 'pharetra', 'et',
    'ultrices', 'neque', 'Diam', 'volutpat', 'commodo', 'sed', 'egestas',
    'egestas', 'fringilla', 'Sodales', 'ut', 'eu', 'sem', 'integer', 'vitae',
    'cursus', 'eget', 'nunc', 'scelerisque', 'viverra', 'mauris', 'in', 'aliquam',
    'nunc', 'sed', 'velit', 'dignissim', 'sodales', 'ut', 'eu', 'sem', 'diam',
    'in', 'arcu', 'cursus', 'euismod', 'quis', 'viverra', 'nibh', 'cras',
    'pulvinar', 'mattis', 'nunc', 'sed', 'blandit', 'Non', 'arcu', 'risus',
    'quis', 'varius', 'neque', 'volutpat', 'ac', 'tincidunt', 'vitae', 'semper',
    'integer', 'enim', 'neque', 'volutpat', 'ac', 'tincidunt', 'vitae', 'semper',
    'quis', 'Magna', 'fermentum', 'iaculis', 'eu', 'non', 'diam', 'phasellus'
];

/**
 * Generate "Lorem ipsum" style words.
 * @param num_words {number} Number of words to generate.
 * @return {string} "Lorem ipsum..."
 */
LoremIpsum.prototype.generate = function (num_words) {
  var words, ii, position, word, current, sentences, sentence_length, sentence;

  /**
   * @default 100
   */
  num_words = num_words || 100;

  words = [LoremIpsum.WORDS[0], LoremIpsum.WORDS[1]];
  num_words -= 2;

  for (ii = 0; ii < num_words; ii++) {
    position = Math.floor(Math.random() * LoremIpsum.WORDS.length);
    word = LoremIpsum.WORDS[position];

    if (ii > 0 && words[ii - 1] === word) {
      ii -= 1;

    } else {
      words[ii] = word;
    }
  }

  sentences = [];
  current = 0;

  while (num_words > 0) {
    sentence_length = this.getRandomSentenceLength();

    if (num_words - sentence_length < 4) {
      sentence_length = num_words;
    }

    num_words -= sentence_length;

    sentence = [];

    for (ii = current; ii < (current + sentence_length); ii++) {
      sentence.push(words[ii]);
    }

    sentence = this.punctuate(sentence);
    current += sentence_length;
    sentences.push(sentence.join(' '));
  }

  return sentences.join(' ');
};

/**
 * Insert commas and periods in the given sentence.
 * @param {Array.string} sentence List of words in the sentence.
 * @return {Array.string} Sentence with punctuation added.
 */
LoremIpsum.prototype.punctuate = function (sentence) {
  var word_length, num_commas, ii, position;

  word_length = sentence.length;

  /* End the sentence with a period. */
  sentence[word_length - 1] += '.';

  if (word_length < 4) {
    return sentence;
  }

  num_commas = this.getRandomCommaCount(word_length);

  for (ii = 0; ii <= num_commas; ii++) {
    position = Math.round(ii * word_length / (num_commas + 1));

    if (position < (word_length - 1) && position > 0) {
      /* Add the comma. */
      sentence[position] += ',';
    }
  }

  /* Capitalize the first word in the sentence. */
  sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);

  return sentence;
};

/**
 * Produces a random number of commas.
 * @param {number} word_length Number of words in the sentence.
 * @return {number} Random number of commas
 */
LoremIpsum.prototype.getRandomCommaCount = function (word_length) {
  var base, average, standard_deviation;

  /* Arbitrary. */
  base = 6;

  average = Math.log(word_length) / Math.log(base);
  standard_deviation = average / base;

  return Math.round(this.gaussMS(average, standard_deviation));
};

/**
 * Produces a random sentence length based on the average word length
 * of an English sentence.
 * @return {number} Random sentence length
 */
LoremIpsum.prototype.getRandomSentenceLength = function () {
  return Math.round(
      this.gaussMS(
          LoremIpsum.WORDS_PER_SENTENCE_AVG,
          LoremIpsum.WORDS_PER_SENTENCE_STD
      )
  );
};

/**
 * Produces a random number.
 * @return {number} Random number
 */
LoremIpsum.prototype.gauss = function () {
  return (Math.random() * 2 - 1) +
      (Math.random() * 2 - 1) +
      (Math.random() * 2 - 1);
};

/**
 * Produces a random number with Gaussian distribution.
 * @param {number} mean
 * @param {number} standard_deviation
 * @return {number} Random number
 */
LoremIpsum.prototype.gaussMS = function (mean, standard_deviation) {
  return Math.round(this.gauss() * standard_deviation + mean);
};
