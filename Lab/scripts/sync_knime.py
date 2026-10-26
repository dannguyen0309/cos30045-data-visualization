"""Copy actual CSV Writer output from a saved workflow directory or .knwf export."""
import argparse
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

LAB=Path(__file__).resolve().parents[1]
NS={'k':'http://www.knime.org/2008/09/XMLConfig'}
OUTPUTS={'tvBrandCount.csv':('Lab-4',18),'energy55.csv':('Lab-5',52),'sizeCounts.csv':('Lab-5',54)}
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('workflows',nargs='*',type=Path)
    args=parser.parse_args()
    sources=args.workflows or [LAB/'Lab-4/KNIME-Exercise-4',LAB/'Lab-5/KNIME-Exercise-5']
    copied=[]
    for source in sources:
        if source.is_dir():
            files={str(p.relative_to(source)).replace('\\','/'):p.read_bytes() for p in source.rglob('*') if p.is_file() and (p.name=='settings.xml' or p.suffix=='.csv')}
        else:
            with zipfile.ZipFile(source) as z:files={n:z.read(n) for n in z.namelist() if n.endswith(('.csv','settings.xml'))}
        for filename,(folder,node_id) in OUTPUTS.items():
            matches=[n for n in files if n.endswith('/data/'+filename) or n=='data/'+filename]
            if not matches:continue
            assert len(matches)==1,f'Ambiguous CSV: {source}, {filename}'
            settings=[n for n in files if f'(#{node_id})/settings.xml' in n]
            assert len(settings)==1,f'Cannot identify CSV Writer #{node_id}'
            root=ET.fromstring(files[settings[0]])
            state=root.find('k:entry[@key="state"]',NS)
            assert state is not None and state.get('value')=='EXECUTED',f'Writer #{node_id} was not saved as EXECUTED'
            destination=LAB/folder/'data'/filename
            destination.write_bytes(files[matches[0]])
            copied.append(str(destination.relative_to(LAB)))
    if not copied:raise SystemExit('No executed CSV Writer outputs found. Export the executed workflows with data, or pass the saved workspace directory.')
    print('\n'.join(copied))
if __name__=='__main__':main()
