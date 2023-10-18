from __future__ import print_function
import os
from bleualign.align import Aligner

if __name__ == '__main__':
	current_path = os.path.dirname(os.path.abspath(__file__))
	options = {
		# source and target files needed by Aligner
		# they can be filenames, arrays of strings or io objects.
		'srcfile':os.path.join(current_path, '..', 'eval', 'eval1989.de'),
		'targetfile': os.path.join(current_path, '..', 'eval', 'eval1989.fr'),
		# translations of srcfile and targetfile, not influenced by 'factored'
		# they can be filenames, arrays of strings or io objects, too.
		'srctotarget': [os.path.join(current_path, '..', 'eval', 'eval1957.europarlfull.fr')],
		'targettosrc': [],
		# passing filenames or io object for them in respectly.
		# if not passing anything or assigning None, they will use StringIO to save results.
		'output-src': None, 'output-target': None,
		'output-src-bad': None, 'output-target-bad': None,
		# other options ...
		}
	options['filter'] = 'sentences'
	options['filterthreshold'] = 66
	a = Aligner(options)
	a.mainloop()
	output_src, output_target = a.results()
	output_src_bad, output_target_bad = a.results_bad()  # if you set options['filter']
	# output_src is StringIO because options['output-src'] is None
	src = output_src.getvalue()  # StringIO member function
	trg = output_target.getvalue().splitlines()  # array of string
	print('output_src.getvalue()')
	print(src[:30])
	print()
	print('output_target.getvalue().splitlines()')
	print(trg[:3])
	print()
	print('filterthreshold for choice good part of alignment: {0}%'.format(options['filterthreshold']))
	print('number of good/bad alignmemts: {0}'.format(len(output_src.getvalue().splitlines()), len(output_src_bad.getvalue().splitlines())))
