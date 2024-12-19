from flask import Flask, render_template, jsonify, url_for
import logging
import os

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Ensure the videos and thumbnails directories exist
os.makedirs(os.path.join(app.static_folder, 'videos'), exist_ok=True)
os.makedirs(os.path.join(app.static_folder, 'thumbnails'), exist_ok=True)

# Demon Slayer Episodes Data
DEMON_SLAYER_DATA = {
    "title": "Demon Slayer: Kimetsu no Yaiba - Swordsmith Village Arc",
    "description": "Tanjiro's journey leads him to the Swordsmith Village, where he must work with the Love and Mist Hashira to defeat powerful demons.",
    "thumbnail_url": "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQyMTMwOTk0._V1_.jpg",
    "score": 9.2,
    "episodes": [
        {
            "title": "Episode 1 - To the Swordsmith Village",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 01.mp4",
            "thumbnail": "https://i.ytimg.com/vi/a9tq0aS5Zu8/maxresdefault.jpg"
        },
        {
            "title": "Episode 2 - Yoriichi Type Zero",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 02.mp4",
            "thumbnail": "https://staticg.sportskeeda.com/editor/2023/04/f6a3c-16818863120509-1920.jpg"
        },
        {
            "title": "Episode 3 - The Yoriichi Type Zero's True Form",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 03.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/04/16/demon-slayer-season-3-episode-3.jpeg"
        },
        {
            "title": "Episode 4 - The Secret of the Nichirin Swords",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 04.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/04/24/demon-slayer-season-3-episode-4.jpeg"
        },
        {
            "title": "Episode 5 - The Mist Hashira Muichiro Tokito",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 05.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/04/30/demon-slayer-season-3-episode-5.jpeg"
        },
        {
            "title": "Episode 6 - The Upper-Rank Demons Gather",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 06.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/05/07/demon-slayer-season-3-episode-6.jpeg"
        },
        {
            "title": "Episode 7 - A Connected Bond: Daybreak and First Light",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 07.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/05/14/demon-slayer-season-3-episode-7.jpeg"
        },
        {
            "title": "Episode 8 - The Love Hashira Mitsuri Kanroji",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 08.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/05/21/demon-slayer-season-3-episode-8.jpeg"
        },
        {
            "title": "Episode 9 - The Battle Between Love and Steel",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 09.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/05/28/demon-slayer-season-3-episode-9.jpeg"
        },
        {
            "title": "Episode 10 - The Love Hashira's Battle",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 10.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/06/04/demon-slayer-season-3-episode-10.jpeg"
        },
        {
            "title": "Episode 11 - The Final Battle",
            "url": "https://s1.secunduscdn.xyz/prime/KimetsuNoYaibaSwordsmithVillageArc/Kimetsu No Yaiba - Katanakaji No Sato-Hen - 11.mp4",
            "thumbnail": "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/06/11/demon-slayer-season-3-episode-11.jpeg"
        }
    ]
}

@app.route('/')
def home():
    logger.debug("Serving home page")
    return render_template('index.html')

@app.route('/api/anime')
def get_anime():
    return jsonify([DEMON_SLAYER_DATA])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
