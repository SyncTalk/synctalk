
from deep_translator import GoogleTranslator
import os
from django.conf import settings
from bleualign.align import Aligner
import json


def alignTranslation(text_path, translation_path, RESULT_PATH):
    directory = os.path.dirname(text_path)
    print(directory)

    srctext = open(text_path, "r", encoding="utf-8")

    # read in text in a list
    sentences = []
    for line in srctext:
        clean_line = line.strip()
        sentences.append(clean_line)
    srctext.close()
    # print(sentences)
    # get machine translation
    print("translating")
    translated = GoogleTranslator(source="auto", target="en").translate_batch(sentences)
    translated = list(filter(lambda x: x is not None, translated))
    print("finished translate")
    # print(translated)
    # save to txt
    with open(
        os.path.join(directory, "srctotarget.txt"), "w", encoding="utf-8"
    ) as file:
        for sentence in translated:
            file.write(sentence + "\n")

    # call aligner
    options = {
        # source and target files needed by Aligner, they can be filenames, arrays of strings or io objects.
        "srcfile": text_path,
        "targetfile": translation_path,
        # translations of srcfile and targetfile, not influenced by 'factored' they can be filenames, arrays of strings or io objects, too.
        "srctotarget": [os.path.join(directory, "srctotarget.txt")],
        "targettosrc": [],
        # passing filenames or io object for them in respectly.
        # if not passing anything or assigning None, they will use StringIO to save results.
        "output-src": os.path.join(directory, "aligner-output-src.txt"),
        "output-target": os.path.join(directory, "aligner-output-target.txt"),
    }
    print("aligning!!")
    a = Aligner(options)
    a.mainloop()
    print("finished align")

    output_src = open(os.path.join(directory, "aligner-output-src.txt"), "r")
    output_target = open(os.path.join(directory, "aligner-output-target.txt"), "r")

    output_src_contents = output_src.read().splitlines()
    output_target_contents = output_target.read().splitlines()

    result = []

    for id, (src_text, target_text) in enumerate(
        zip(output_src_contents, output_target_contents), start=1
    ):
        # Create a dictionary for each pair of source and target text
        entry = {"id": id, "text": src_text, "translation": target_text}

        # Append the dictionary to the result list
        result.append(entry)

    output_src.close()
    output_target.close()

    # print(result)

    with open(RESULT_PATH, "w", encoding="utf-8") as json_file:
        json.dump(result, json_file, ensure_ascii=False)
    return









