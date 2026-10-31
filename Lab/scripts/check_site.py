"""Check the actual static build for broken local references and duplicate HTML IDs."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):self.ids.append(attrs['id'])
        for key in ['href','src']:
            if key in attrs:self.links.append(attrs[key])

def main():
    assert ROOT.is_dir(),'Run node Lab/scripts/build_site.cjs first'
    pages={}
    for file in ROOT.rglob('*.html'):
        parser=Page();parser.feed(file.read_text(encoding='utf-8-sig'))
        assert len(parser.ids)==len(set(parser.ids)),f'Duplicate IDs: {file}'
        pages[file.resolve()]=parser
    checked=0
    for file,parser in pages.items():
        for link in parser.links:
            url=urlsplit(link)
            if url.scheme or url.netloc:continue
            target=(ROOT/url.path.lstrip('/') if url.path.startswith('/') else file.parent/unquote(url.path)).resolve() if url.path else file
            if target.is_dir():target=target/'index.html'
            assert target.is_relative_to(ROOT.resolve()),f'Path escapes site: {link}'
            assert target.exists(),f'Broken reference in {file.name}: {link}'
            if url.fragment and target in pages:
                assert unquote(url.fragment) in pages[target].ids,f'Missing anchor: {link}'
            checked+=1
    # Hosting output must not contain old labs, workflow caches or executable build scripts.
    assert not any(ROOT.rglob('*.knwf'))
    assert not (ROOT/'scripts').exists()
    assert not (ROOT/'Lab-1').exists()
    print(f'PASS: {len(pages)} HTML pages; {checked} local references; unique IDs; website-only build.')

if __name__=='__main__':main()
