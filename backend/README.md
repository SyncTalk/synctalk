# Backend

This project relies on the Bleualign, which is a fantastic library for sentence alignment tool for parallel text. Link to Bleualign project: https://github.com/rsennrich/Bleualign
We also used Whisper, which is a powerful general-purpose speech recognition model developed by OpenAI, we utilise the transcription function of the model to align audio. Please note, Whisper's processing speed is noticeably slower on CPU than GPU.  

## Requirements

Before you can run this project, you'll need to ensure that you have the following dependencies installed:
```
#Django
python -m pip install Django
python -m pip install djangorestframework

#module for processing text files
pip install PyPDF2
pip install python-docx
pip install num2words
pip install -U deep-translator
pip install nltk

#module for processing audio files
python -m pip install -U openai-whisper
sudo apt update && sudo apt install ffmpeg

#set up alignment tool, bleualign
git submodule init

```

## Deployment Instructions

Active virtual environment
`python3 -m venv venv`
`.venv/bin/active`

Install requirements
`pip install -r requirments.txt`

Run backend server
`python3 manage.py runserver`

## Usage
The backend provides an API endpoint for uploading text and audio data and returning aligned text and audio

## API:
The base URL for all API requests is: http://170.64.161.104:8000  

**Access the Upload Endpoint:**  - Use an API client, such as Postman, to interact with the upload API.  
**Make a POST Request:** Send a POST request to the following endpoint: ``` http://170.64.161.104:8000/upload/ ```    
**Provide Form Data:**  In the request body, include form data with the following fields:    
	-  `text`: The text data you want to upload.    
	-  `audio`: The audio data you want to upload.   
	-  `translation`: The English translation of the text  
	-  `lang`: the language of the original text. tested languages: en,zh,fr *  

<sup>* Full list of languages supported by whisper but we haven't test: Afrikaans (af), Arabic (ar), Armenian (hy), Azerbaijani (az), Belarusian (be), Bosnian (bs), Bulgarian (bg), Catalan (ca), Chinese (zh), Croatian (hr), Czech (cs), Danish (da), Dutch (nl), English (en), Estonian (et), Finnish (fi), French (fr), Galician (gl), German (de), Greek (el), Hebrew (he), Hindi (hi), Hungarian (hu), Icelandic (is), Indonesian (id), Italian (it), Japanese (ja), Kannada (kn), Kazakh (kk), Korean (ko), Latvian (lv), Lithuanian (lt), Macedonian (mk), Malay (ms), Marathi (mr), Maori (mi), Nepali (ne), Norwegian (no), Persian (fa), Polish (pl), Portuguese (pt), Romanian (ro), Russian (ru), Serbian (sr), Slovak (sk), Slovenian (sl), Spanish (es), Swahili (sw), Swedish (sv), Tagalog (tl), Tamil (ta), Thai (th), Turkish (tr), Ukrainian (uk), Urdu (ur), Vietnamese (vi), and Welsh (cy).  <sup> 

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
