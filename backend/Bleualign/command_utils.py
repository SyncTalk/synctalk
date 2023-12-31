#!/usr/bin/python
# -*- coding: utf-8 -*-
# Copyright © 2010 University of Zürich
# Author: Rico Sennrich <sennrich@cl.uzh.ch>
# For licensing information, see LICENSE


from __future__ import division, print_function
import sys
import os
import getopt


def usage():
    bold = "\033[1m"
    reset = "\033[0;0m"
    italic = "\033[3m"

    print(
        "\n\t All files need to be one sentence per line and have .EOA as a hard delimiter. --source, --target and --output are mandatory arguments, the others are optional."
    )
    print("\n\t" + bold + "--help" + reset + ", " + bold + "-h" + reset)
    print("\t\tprint usage information\n")
    print("\t" + bold + "--source" + reset + ", " + bold + "-s" + reset + " file")
    print("\t\tSource language text.")
    print("\t" + bold + "--target" + reset + ", " + bold + "-t" + reset + " file")
    print("\t\tTarget language text.")
    print("\t" + bold + "--output" + reset + ", " + bold + "-o" + reset + " filename")
    print("\t\tOutput file: Will create " + "filename" + "-s and " + "filename" + "-t")
    print("\n\t" + bold + "--srctotarget" + reset + " file")
    print(
        "\t\tTranslation of source language text to target language. Needs to be sentence-aligned with source language text."
    )
    print("\t" + bold + "--targettosrc" + reset + " file")
    print(
        "\t\tTranslation of target language text to source language. Needs to be sentence-aligned with target language text."
    )
    print("\n\t" + bold + "--factored" + reset)
    print(
        "\t\tSource and target text can be factored (as defined by moses: | as separator of factors, space as word separator). Only first factor will be used for BLEU score."
    )
    print("\n\t" + bold + "--filter" + reset + ", " + bold + "-f" + reset + " option")
    print("\t\tFilters output. Possible options:")
    print(
        "\t\t"
        + bold
        + "sentences"
        + reset
        + "\tevaluate each sentence and filter on a per-sentence basis"
    )
    print(
        "\t\t"
        + bold
        + "articles"
        + reset
        + "\tevaluate each article and filter on a per-article basis"
    )
    print("\n\t" + bold + "--filterthreshold" + reset + " int")
    print(
        "\t\tFilters output to best XX percent. (Default: 90). Only works if --filter is set."
    )
    print("\t" + bold + "--bleuthreshold" + reset + " float")
    print(
        "\t\tFilters out sentence pairs with sentence-level BLEU score < XX (in range from 0 to 1). (Default: 0). Only works if --filter is set."
    )
    print("\t" + bold + "--filterlang" + reset)
    print(
        "\t\tFilters out sentences/articles for which BLEU score between source and target is higher than that between translation and target (usually means source and target are in same language). Only works if --filter is set."
    )
    print("\n\t" + bold + "--bleu_n" + reset + " int")
    print("\t\tConsider n-grams up to size n for BLEU. Default 2.")
    print("\t" + bold + "--bleu_charlevel" + reset)
    print(
        "\t\tPerform BLEU on charcter-level (recommended for continuous script language; also consider increasing bleu_n)."
    )
    print("\n\t" + bold + "--galechurch" + reset)
    print(
        "\t\tAlign the bitext using Gale and Church's algorithm (without BLEU comparison)."
    )
    print("\t" + bold + "--printempty" + reset)
    print("\t\tAlso write unaligned sentences to file. By default, they are discarded.")
    print("\t" + bold + "--verbosity" + reset + ", " + bold + "-v" + reset + " int")
    print(
        "\t\tVerbosity. Choose amount of debugging output. Default value 1; choose 0 for (mostly) quiet mode, 2 for verbose output"
    )
    print("\t" + bold + "--processes" + reset + ", " + bold + "-p" + reset + " int")
    print(
        "\t\tNumber of parallel processes. Documents are split across available processes. Default: 4."
    )


def load_arguments(sysargv):
    try:
        opts, args = getopt.getopt(
            sysargv[1:],
            "def:ho:s:t:v:p:",
            [
                "factored",
                "filter=",
                "filterthreshold=",
                "bleuthreshold=",
                "filterlang",
                "printempty",
                "deveval",
                "eval",
                "help",
                "bleu_n=",
                "bleu_charlevel",
                "galechurch",
                "output=",
                "source=",
                "target=",
                "srctotarget=",
                "targettosrc=",
                "verbosity=",
                "printempty=",
                "processes=",
            ],
        )
    except getopt.GetoptError as err:
        # print help information and exit:
        print(str(err))  # will print something like "option -a not recognized"
        usage()
        sys.exit(2)
    options = {}
    options["srcfile"] = None
    options["targetfile"] = None
    options["output"] = None
    options["srctotarget"] = []
    options["targettosrc"] = []
    options["processes"] = 4
    bold = "\033[1m"
    reset = "\033[0;0m"

    project_path = os.path.dirname(os.path.abspath(__file__))
    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
            sys.exit()
        elif o in ("-e", "--eval"):
            options["srcfile"] = os.path.join(project_path, "eval", "eval1989.de")
            options["targetfile"] = os.path.join(project_path, "eval", "eval1989.fr")
            from eval import goldeval

            goldalign = [None] * len(goldeval.gold1990map)
            for index, data in list(goldeval.gold1990map.items()):
                goldalign[index] = goldeval.gold[data]
            options["eval"] = goldalign
        elif o in ("-d", "--deveval"):
            options["srcfile"] = os.path.join(project_path, "eval", "eval1957.de")
            options["targetfile"] = os.path.join(project_path, "eval", "eval1957.fr")
            from eval import golddev

            goldalign = [golddev.goldalign]
            options["eval"] = goldalign
        elif o in ("-o", "--output"):
            options["output"] = a
        elif o == "--factored":
            options["factored"] = True
        elif o in ("-f", "--filter"):
            if a in ["sentences", "articles"]:
                options["filter"] = a
            else:
                print(
                    "\nERROR: Valid values for option "
                    + bold
                    + "--filter"
                    + reset
                    + " are "
                    + bold
                    + "sentences "
                    + reset
                    + "and "
                    + bold
                    + "articles"
                    + reset
                    + "."
                )
                usage()
                sys.exit(2)
        elif o == "--filterthreshold":
            options["filterthreshold"] = float(a)
        elif o == "--bleuthreshold":
            options["bleuthreshold"] = float(a)
        elif o == "--filterlang":
            options["filterlang"] = True
        elif o == "--galechurch":
            options["galechurch"] = True
        elif o == "--bleu_n":
            options["bleu_ngrams"] = int(a)
        elif o == "--bleu_charlevel":
            options["bleu_charlevel"] = True
        elif o in ("-s", "--source"):
            if not "eval" in options:
                options["srcfile"] = a
        elif o in ("-t", "--target"):
            if not "eval" in options:
                options["targetfile"] = a
        elif o == "--srctotarget":
            if a == "-":
                options["no_translation_override"] = True
            else:
                options["srctotarget"].append(a)
        elif o == "--targettosrc":
            options["targettosrc"].append(a)
        elif o == "--printempty":
            options["printempty"] = True
        elif o in ("-v", "--verbosity"):
            global loglevel
            loglevel = int(a)
            options["loglevel"] = int(a)
            options["verbosity"] = int(a)
        elif o in ("-p", "--processes"):
            options["num_processes"] = int(a)
        else:
            assert False, "unhandled option"

    if not options["output"]:
        print("WARNING: Output not specified. Just printing debugging output.", 0)
    if not options["srcfile"]:
        print("\nERROR: Source file not specified.")
        usage()
        sys.exit(2)
    if not options["targetfile"]:
        print("\nERROR: Target file not specified.")
        usage()
        sys.exit(2)
    if options["targettosrc"] and not options["srctotarget"]:
        print(
            "\nWARNING: Only --targettosrc specified, but expecting at least one --srctotarget. Please swap source and target side."
        )
        sys.exit(2)
    if (
        not options["srctotarget"]
        and not options["targettosrc"]
        and "no_translation_override" not in options
    ):
        print(
            "ERROR: no translation available: BLEU scores can be computed between the source and target text, but this is not the intended usage of Bleualign and may result in poor performance! If you're *really* sure that this is what you want, use the option '--srctotarget -'"
        )
        sys.exit(2)
    return options
