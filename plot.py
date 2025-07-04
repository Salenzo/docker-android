import os
import json
from collections import Counter
h = Counter()
for f in os.scandir('request_log'):
	print(f)
	with open(f.path, 'rb') as f:
		j = json.load(f)
	if 'her_name' in j:
		for (option, count), in map(dict.items, j['her_name']):
			h[option] = max(h[option], count)
for option, count in h.most_common():
	print(count, option, sep='\t')
