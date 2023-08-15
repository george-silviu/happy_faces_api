const MODEL_ID = "face-detection"; //clarafai model used for image recognition
const clarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "425b61ce7bbd4feca1723235cc4fe116";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "george-silviu";
  const APP_ID = "face-recognition-app";
  // Change these to whatever model and image URL you want to use
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

const handleClarifaiApiCall = (req, res) => {
  //make request to Clarifai API
  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    clarifaiRequestOptions(req.body.input)
  )
    .then((response) => response.json())
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.status(400).json("error accessing AI api"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.status(200).json(entries[0].entries))
    .catch((err) => res.status(400).json("error getting entries"));
};

module.exports = { handleImage, handleClarifaiApiCall };
