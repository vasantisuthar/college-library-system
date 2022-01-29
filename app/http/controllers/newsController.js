const NewsAPI = require('newsapi');

const newsController = () => {
    return{
        getNews(req, res){
            const newsapi = new NewsAPI(process.env.news_api_key);
            // To query /v2/top-headlines
            // All options passed to topHeadlines are optional, but you need to include at least one of them
            newsapi.v2.sources({
                category: 'technology',
                language: 'en',
                country: 'us'
              }).then(response => {
                console.log(response);
                res.render('news',{responses:response.sources})
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