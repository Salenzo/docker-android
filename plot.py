import os
import json
from collections import Counter
h = Counter()
for f in os.scandir('request_log'):
	with open(f.path, 'rb') as f:
		j = f.read()
		if not j: continue
		j = json.loads(j)
	if 'her_name' in j:
		for (option, count), in map(dict.items, j['her_name']):
			h[option] = max(h[option], count)
for option, count in h.most_common():
	print(count, option, sep='\t')
