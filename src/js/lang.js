var TRANSLATE = {
  defaulLang: "ru",
  lang: {
    "uk": {
      //assets\js\quest-index.js
      " верных": " вірних",

      //assets\js\quest-test.js
      "Вы верно ответили на $0$ с $1$ вопросов</br>Ваше время: $2$":"Ви правильно відповіли на $0$ з $1$ питань</br>Ваш час: $2$",
      "Вопрос $0$ c $1$":"Питання $0$ з $1$",
      "Результат":"Результат",
      "Далее":"Далі",
    }
  },

  get: function(text) {
    if (LANG == TRANSLATE.defaulLang) return text;
    
    return TRANSLATE.lang[LANG][text];
  },

  getFormat: function(text, values) {
    if (LANG != TRANSLATE.defaulLang) text = TRANSLATE.lang[LANG][text];

    for (var i = 0; i < values.length; i++) {
      text = text.replace("$"+ i +"$", values[i]);
    }
    
    return text;
  }
}