const NewsAPI = require('newsapi');

const newsController = () => {
    return{
        getNews(req, res){
            const newsapi = new NewsAPI(process.env.news_api_key);
            // All options passed to topHeadlines are optional, but you need to include at least one of them
            newsapi.v2.topHeadlines({
                category: 'technology',
                language: 'en',
                country: 'in'
              }).then(response => {
                console.log(response)
                return res.render('news',{responses:response.articles})
                /*
                  {
                    status: "ok",
                    sources: [...]
                  }
                */
              });
        }
    }
}

module.exports = newsController;