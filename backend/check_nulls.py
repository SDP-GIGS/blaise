import glob

bad = []
for p in glob.glob('**/*.py', recursive=True):
    try:
        with open(p, 'rb') as f:
            if b'\x00' in f.read():
                bad.append(p)
    except Exception:
        pass

print('bad files:', bad)
