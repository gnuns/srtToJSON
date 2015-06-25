/**********************************************************
 * @author Gabriel Nunes <@Gnuns>
 * @version 0.0.1
 * @license The MIT License (MIT)
 **********************************************************
 * @param {string} content The .srt file content
 * @returns {string} The SRT file content converted to JSON
 *********************************************************/
var srtToJSON = function(content)
{
  var quotesArray = [];

  var lines = content.split('\r\n');

  var currentQuoteNumber = 0;

  var lineTypes =
  {
    INDEX : 0,
    TIMECODE: 1,
    TEXT: 2
  }

  var nextLineType = lineTypes.INDEX;

  for(var n in lines)
  {
    var line = lines[n].toString();
    var qN = parseInt(line, 10);

    if(line == '')
    {
      nextLineType = lineTypes.INDEX;
    }
    else if(nextLineType == lineTypes.INDEX && qN !== NaN)
    {
        currentQuoteNumber = qN;
        var quote = {
          start_time  : '',
          end_time    : '',
          text        : ''
        };
        quotesArray[currentQuoteNumber] = quote;
        nextLineType = lineTypes.TIMECODE;
    }
    else if (nextLineType == lineTypes.TIMECODE)
    {
      var timeCode = line.split(' --> ');
      quotesArray[currentQuoteNumber].start_time  = timeCode[0];
      quotesArray[currentQuoteNumber].end_time    = timeCode[1];
      nextLineType = lineTypes.TEXT;
    }
    else if (nextLineType == lineTypes.TEXT)
    {
      if(quotesArray[currentQuoteNumber].text != '') {
        quotesArray[currentQuoteNumber].text += '\n';
      }
      quotesArray[currentQuoteNumber].text += line;
    }
  }
  return JSON.stringify(quotesArray.filter(function(q){return (q != null);}));
}
