# Backend


## Requirements

Before you can run this project, you'll need to ensure that you have the following dependencies installed:
```
#Django
python -m pip install Django
python -m pip install djangorestframework

#processing text files
pip install PyPDF2
pip install python-docx
pip install num2words
pip install -U deep-translator
pip install nltk

#processing audio files
python -m pip install -U openai-whisper
sudo apt update && sudo apt install ffmpeg

#set up alignment tool, bleualign

git submodule init
git submodule update
cd backend/bleualign
python setup.py install
```

## Start the development server  (Linux)

Active virtual environment
`python3 -m venv venv`
`.venv/bin/active`

Install requirements
`pip install -r requirments.txt`

Run backend server
`python3 manage.py runserver`

## Usage
The backend provides an API endpoint for uploading text and audio data and returning aligned text and audio

**Access the Upload Endpoint:**  - Use an API client, such as Postman, to interact with the upload API.  
**Make a POST Request:** Send a POST request to the following endpoint: ``` POST http://localhost:8000/upload/ ```    
**Provide Form Data:**  In the request body, include form data with the following fields:    
	-  `text`: The text data you want to upload.    
	-  `audio`: The audio data you want to upload. 
	-  `translation` : The English translation of the text  
	-  `lang`: the language of the original text. supported languages: en,zh,fr

**Response:** Upon successful upload, you will receive a response with status code 200 and a JSON object containing timestamps and corresponding sentences. The response format will look like this:   
```
{ 
	{  
	"start":  "00:00:05",
	"end":  "00:00:30"
	"text":  "这是第一句话"  
	"translation": "This is the first sentence.”  
	}, 
	{
	"start":  "00:00:31", 
	"end": "00:00:50"
	"text":  "这是第二句话" 
	"translation": "This is the second sentence.” 
	}
}
```
