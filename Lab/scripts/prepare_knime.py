"""Prepare exercise workflows from the supplied KNIME settings; never fake execution."""
from pathlib import Path
import copy
import shutil
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[2]
LAB = ROOT / 'Lab'
NS = 'http://www.knime.org/2008/09/XMLConfig'
ET.register_namespace('', NS)
def config(node, key):
    found = node.find(f'{{{NS}}}config[@key="{key}"]')
    if found is None:
        found = ET.SubElement(node, f'{{{NS}}}config', key=key)
    return found
def entry(node, key, value, kind='xstring'):
    found = node.find(f'{{{NS}}}entry[@key="{key}"]')
    if found is None:
        found = ET.SubElement(node, f'{{{NS}}}entry', key=key, type=kind)
    found.attrib.pop('isnull', None)
    found.set('value', str(value))
    return found
def array(node, values, kind='xstring'):
    node[:] = []
    entry(node, 'array-size', len(values), 'xint')
    for i, value in enumerate(values): entry(node, str(i), value, kind)
def save(root, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    ET.indent(root)
    ET.ElementTree(root).write(path, encoding='utf-8', xml_declaration=True)
def unpack(name):
    out = ROOT / 'tmp' / 'demo2-workflows' / name
    with zipfile.ZipFile(LAB / f'{name}.knwf') as z:
        for member in z.infolist():
            assert (out / member.filename).resolve().is_relative_to(out.resolve())
        z.extractall(out)
    return next(out.glob('*/workflow.knime')).parent

W4 = unpack('2026 TV Data')
W6 = unpack('W6 TV Data')
WRITER = ET.parse(W6 / 'CSV Writer (#61)' / 'settings.xml').getroot()

def writer(filename):
    root = copy.deepcopy(WRITER)
    model = config(root, 'model')
    chooser = config(config(model, 'settings'), 'file_chooser_settings')
    entry(config(chooser, 'path'), 'path', filename)
    entry(chooser, 'if_path_exists', 'overwrite')
    entry(config(model, 'advanced_settings'), 'quote_mode', 'NEVER')
    entry(root, 'state', 'IDLE')
    entry(root, 'hasContent', 'false', 'xboolean')
    config(root, 'filestores')[:] = []
    return root

def make_workflow(source, destination, keep):
    if destination.exists(): raise FileExistsError(f'Không ghi đè workflow: {destination}')
    root = ET.parse(source / 'workflow.knime').getroot()
    nodes = config(root, 'nodes')
    for node in list(nodes):
        identifier = int(node.find(f'{{{NS}}}entry[@key="id"]').get('value'))
        if identifier not in keep: nodes.remove(node); continue
        settings = node.find(f'{{{NS}}}entry[@key="node_settings_file"]').get('value')
        original = ET.parse(source / settings).getroot()
        entry(original, 'state', 'IDLE')
        entry(original, 'hasContent', 'false', 'xboolean')
        for key in ['ports', 'filestores']: config(original, key)[:] = []
        save(original, destination / settings)
    config(root, 'connections')[:] = []
    entry(root, 'state', 'IDLE')
    config(root, 'annotations')[:] = []
    (destination / 'data').mkdir(parents=True)
    shutil.copy2(W4 / 'data/tv_2026_02_15.csv', destination / 'data/tv_2026_02_15.csv')
    return root

def add_node(workflow, destination, identifier, name, settings, x, y):
    filename = f'{name} (#{identifier})/settings.xml'
    template = copy.deepcopy(next(iter(config(workflow, 'nodes'))))
    template.set('key', f'node_{identifier}')
    entry(template, 'id', identifier, 'xint')
    entry(template, 'node_settings_file', filename)
    bounds = config(config(template, 'ui_settings'), 'extrainfo.node.bounds')
    entry(bounds, '0', x, 'xint'); entry(bounds, '1', y, 'xint')
    config(workflow, 'nodes').append(template)
    save(settings, destination / filename)

def connect(workflow, edges):
    connections = config(workflow, 'connections')
    for i, (source, target) in enumerate(edges):
        item = config(connections, f'connection_{i}')
        for key, value in [('sourceID',source),('destID',target),('sourcePort',1),('destPort',1)]:
            entry(item,key,value,'xint')

def groupby(group, columns, methods, types):
    root = ET.parse(LAB / 'Lab-2/Exercise-2/Technology summary (#38)/settings.xml').getroot()
    model = config(root, 'model')
    groups = config(model, 'grouByColumns')
    array(config(groups, 'InclList'), [group]); array(config(groups, 'ExclList'), [])
    agg = config(model, 'aggregationColumn')
    array(config(agg,'columnNames'), columns)
    array(config(agg,'aggregationMethod'), methods)
    array(config(agg,'inclMissingVals'), ['false']*len(columns), 'xboolean')
    column_types = config(agg,'columnTypes'); column_types[:] = []
    entry(column_types,'array-size',len(types),'xint')
    for i, kind in enumerate(types):
        cell = config(column_types,str(i))
        entry(cell,'cell_class',f'org.knime.core.data.def.{kind}Cell')
        entry(cell,'is_null','false','xboolean')
    entry(root,'state','IDLE'); entry(root,'hasContent','false','xboolean')
    config(root,'ports')[:] = []; config(root,'filestores')[:] = []
    return root

def main():
    dest4 = LAB / 'Lab-4/KNIME-Exercise-4'
    wf4 = make_workflow(W4,dest4,{1,4,5,6,7,9,10,16,17})
    add_node(wf4,dest4,18,'CSV Writer',writer('tvBrandCount.csv'),1070,-70)
    connect(wf4,[(1,4),(4,5),(5,6),(6,7),(7,9),(9,10),(10,17),(17,16),(16,18)])
    save(wf4,dest4/'workflow.knime')
    dest5 = LAB / 'Lab-5/KNIME-Exercise-5'
    wf5 = make_workflow(LAB/'Lab-2/Exercise-2',dest5,{13,15,27,28,18,19,32})
    rowfilter=ET.parse(W6/'Row Filter (#58)/settings.xml').getroot()
    for e in rowfilter.iter():
        if e.get('key')=='selected': e.set('value','screensize_inch_rounded')
    entry(rowfilter,'state','IDLE'); entry(rowfilter,'hasContent','false','xboolean')
    config(rowfilter,'ports')[:] = []; config(rowfilter,'filestores')[:] = []
    add_node(wf5,dest5,50,'55 inch filter',rowfilter,900,0)
    add_node(wf5,dest5,51,'55 inch energy GroupBy',groupby('Screen_Tech',['Labelled energy consumption (kWh/year)','Model_No'],['Mean','Count'],['Double','String']),1080,0)
    add_node(wf5,dest5,52,'Energy CSV Writer',writer('energy55.csv'),1260,0)
    add_node(wf5,dest5,53,'Size GroupBy',groupby('screensize_category',['Model_No'],['Count'],['String']),1080,180)
    add_node(wf5,dest5,54,'Size CSV Writer',writer('sizeCounts.csv'),1260,180)
    connect(wf5,[(13,15),(15,27),(27,28),(28,18),(18,19),(19,32),(19,50),(50,51),(51,52),(32,53),(53,54)])
    save(wf5,dest5/'workflow.knime')
    for folder in [dest4,dest5]:
        with zipfile.ZipFile(folder.with_suffix('.knwf'),'w',zipfile.ZIP_DEFLATED) as z:
            for path in folder.rglob('*'):
                if path.is_file(): z.write(path,f'{folder.name}/{path.relative_to(folder).as_posix()}')
        print(folder.with_suffix('.knwf'))

if __name__ == '__main__': main()
