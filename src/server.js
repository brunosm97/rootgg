const express = require("express")
const bodyParser = require("body-parser") //requerindo biblioteca 
const axios = require("axios")
require("dotenv").config()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const config = {
    headers: {
        "X-Riot-Token": process.env.API_KEY
    }
}

const tft_url = {
    br1: "https://br1.api.riotgames.com/tft",
    americas: "https://americas.api.riotgames.com/tft"
}

const handleError = (error, res) => {
    console.error(error.response)
    res.status(error.response.status).send(error.response.statusText)
}

const getMatchesListByPuuid = async puuid => {
    const result = await axios.get(tft_url.americas + "/match/v1/matches/by-puuid/" + puuid + "/ids?count=20", config)                 
    return result.data        
}

const getSummonerDTOBySummonerName = async summoner_name => {
    const result = await axios.get(tft_url.br1 + "/summoner/v1/summoners/by-name/" + summoner_name, config)
    return result.data
}

app.get("/users/:summoner_name/matches", async (req, res) => {
    const summoner_name = req.params.summoner_name
    const summonerDTO = await getSummonerDTOBySummonerName(summoner_name)
    const matches_list = await getMatchesListByPuuid(summonerDTO.puuid)

    res.send(matches_list)
})

app.listen(8000, () => {
    console.log("servidor rodando")
})



