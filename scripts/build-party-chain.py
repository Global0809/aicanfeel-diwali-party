"""Offline thick gold necklace and embossed Diwali Party pendant, native cm.
Run with Blender --background --factory-startup --python this-file.
The website loads only the prepacked native meshes; Blender is not a dependency.
"""
import bpy, math, os, json, gzip
import copy, hashlib, struct, re
from mathutils import Vector

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'vendor','accessories')
os.makedirs(OUT,exist_ok=True)
ANCHORS=[(0,123.5,15.8),(10.5,132,11),(15.5,139.2,0),(10.5,139,-10.5),(0,138,-13),(-10.5,139,-10.5),(-15.5,139.2,0),(-10.5,132,11)]

def curve(t):
    segment=math.floor(t); u=t-segment
    a,b,c,d=[Vector(ANCHORS[i%8]) for i in (segment-1,segment,segment+1,segment+2)]
    return .5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u)

# Equal physical spacing preserves consistent link size around the complete loop.
samples=[curve(i*8/1600) for i in range(1601)]
distances=[0.]
for a,b in zip(samples,samples[1:]): distances.append(distances[-1]+(b-a).length)
def at_distance(s):
    import bisect
    i=min(len(distances)-2,max(0,bisect.bisect_right(distances,s)-1))
    t=(s-distances[i])/max(1e-8,distances[i+1]-distances[i])
    return (i+t)*8/1600

class Geometry:
    def __init__(self): self.p=[];self.n=[];self.uv=[];self.idx=[]
    def vertex(self,p,n,uv=(0.,0.)):
        i=len(self.p)//3;self.p.extend(float(v)for v in p);self.n.extend(float(v)for v in n);self.uv.extend(uv);return i
    def triangle(self,a,b,c): self.idx.extend((a,b,c))
    def export(self): return dict(positions=self.p,normals=self.n,uvs=self.uv,indices=self.idx)

def link(g,center,tangent,minor,major_radius,minor_radius,tube,segments,sides):
    tangent=Vector(tangent).normalized();minor=Vector(minor).normalized();normal=tangent.cross(minor).normalized()
    start=len(g.p)//3
    for i in range(segments):
        theta=2*math.pi*i/segments;c=math.cos(theta);s=math.sin(theta)
        point=Vector(center)+tangent*(major_radius*c)+minor*(minor_radius*s)
        radial=(tangent*(c/major_radius)+minor*(s/minor_radius)).normalized()
        for j in range(sides):
            phi=2*math.pi*j/sides;n=radial*math.cos(phi)+normal*math.sin(phi)
            g.vertex(point+n*tube,n,(i/segments,j/sides))
    for i in range(segments):
        for j in range(sides):
            a=start+i*sides+j;b=start+((i+1)%segments)*sides+j
            c=start+((i+1)%segments)*sides+(j+1)%sides;d=start+i*sides+(j+1)%sides
            g.triangle(a,b,c);g.triangle(a,c,d)

def rounded_path(w,h,r,steps):
    result=[]
    corners=[(w/2-r,-h/2+r,-math.pi/2),(w/2-r,h/2-r,0),(-w/2+r,h/2-r,math.pi/2),(-w/2+r,-h/2+r,math.pi)]
    for x,y,first in corners:
        for j in range(steps+1):
            angle=first+j/steps*math.pi/2
            result.append(((x+r*math.cos(angle),y+r*math.sin(angle)),(math.cos(angle),math.sin(angle))))
    return result

def slab(g,w,h,r,back,front,bevel,center_y,steps):
    levels=[(w-2*bevel,h-2*bevel,max(.05,r-bevel),back,.707,-.707),(w,h,r,back+bevel,1.,0.),(w,h,r,front-bevel,1.,0.),(w-2*bevel,h-2*bevel,max(.05,r-bevel),front,.707,.707)]
    rings=[]
    for lw,lh,lr,z,side,face in levels:
        ring=[]
        for (x,y),(nx,ny) in rounded_path(lw,lh,lr,steps):
            ring.append(g.vertex((x,y+center_y,z),Vector((nx*side,ny*side,face)).normalized(),(x/w+.5,y/h+.5)))
        rings.append(ring)
    N=len(rings[0])
    for lo,hi in zip(rings,rings[1:]):
        for i in range(N):
            j=(i+1)%N;g.triangle(lo[i],lo[j],hi[j]);g.triangle(lo[i],hi[j],hi[i])
    for front_cap in (False,True):
        lw,lh,lr,z,_,_=levels[-1]if front_cap else levels[0]
        normal=(0,0,1 if front_cap else -1);middle=g.vertex((0,center_y,z),normal,(.5,.5));ring=[]
        for (x,y),_ in rounded_path(lw,lh,lr,steps):ring.append(g.vertex((x,y+center_y,z),normal,(x/w+.5,y/h+.5)))
        for i in range(N):
            j=(i+1)%N
            if front_cap:g.triangle(middle,ring[i],ring[j])
            else:g.triangle(middle,ring[j],ring[i])


def lettering(g, phone):
    """Solid two-line text; each line is centered and height/width bounded."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    font_path = 'C:/Windows/Fonts/arialbd.ttf'
    if not os.path.exists(font_path):
        font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    if not os.path.exists(font_path):
        raise RuntimeError('Bold pendant font is unavailable')
    font = bpy.data.fonts.load(font_path)
    stats = []
    for word, center_y in [('Diwali', 118.45), ('Party', 113.7)]:
        data = bpy.data.curves.new('Party embossed ' + word, 'FONT')
        data.body = word
        data.align_x = 'CENTER'
        data.font = font
        data.size = 4.
        data.extrude = .14
        data.bevel_depth = .035 if phone else .055
        data.bevel_resolution = 0 if phone else 1
        data.resolution_u = 2 if phone else 4
        obj = bpy.data.objects.new('Party solid ' + word, data)
        bpy.context.collection.objects.link(obj)
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.convert(target='MESH')
        mesh = obj.data
        mesh.calc_loop_triangles()
        xs = [v.co.x for v in mesh.vertices]
        ys = [v.co.y for v in mesh.vertices]
        # A broad, signet-like inscription remains readable at the full-body
        # camera distance. Both lines have the same height and deliberately
        # wide proportions, matching the reference's extended lettering.
        width = 21.8 if word == 'Diwali' else 19.6
        scale_x = width / (max(xs)-min(xs))
        scale_y = 3.9 / (max(ys)-min(ys))
        cx, cy = (max(xs)+min(xs))/2, (max(ys)+min(ys))/2
        for triangle in mesh.loop_triangles:
            ids = []
            for loop_id in triangle.loops:
                v = mesh.vertices[mesh.loops[loop_id].vertex_index].co
                base_n = mesh.corner_normals[loop_id].vector
                n = Vector((base_n.x/scale_x,base_n.y/scale_y,base_n.z)).normalized()
                p = ((v.x-cx)*scale_x, center_y+(v.y-cy)*scale_y, 18.24+v.z)
                ids.append(g.vertex(p, n, ((p[0]+13.2)/26.4, (p[1]-110)/12)))
            g.triangle(*ids)
        stats.append({'word':word, 'triangles':len(mesh.loop_triangles),
                      'width':width, 'height':3.9})
        obj.select_set(False)
    return stats


def validate_group(name, g):
    n = len(g['positions'])//3
    if len(g['normals']) != n*3 or len(g['uvs']) != n*2:
        raise RuntimeError('Accessory attribute lengths differ: '+name)
    if n > 65535 or any(i < 0 or i >= n for i in g['indices']):
        raise RuntimeError('Accessory index outside native Uint16 range: '+name)
    if any(not math.isfinite(v) for values in g.values() for v in values):
        raise RuntimeError('Non-finite accessory geometry: '+name)
    bounds = [[min(g['positions'][axis::3]),max(g['positions'][axis::3])] for axis in range(3)]
    if bounds[0][0] < -19 or bounds[0][1] > 19 or bounds[1][0] < 109 or bounds[1][1] > 143 or bounds[2][0] < -17 or bounds[2][1] > 20:
        raise RuntimeError('Accessory leaves the bounded neck/chest region: '+name)
    return bounds


def compact_group(group):
    """Reuse identical position/normal/UV tuples without changing shading."""
    seen = {}
    remap = []
    result = dict(positions=[], normals=[], uvs=[], indices=[])
    for i in range(len(group['positions'])//3):
        p = group['positions'][i*3:i*3+3]
        n = group['normals'][i*3:i*3+3]
        uv = group['uvs'][i*2:i*2+2]
        key = tuple(round(float(value),7) for value in p+n+uv)
        target = seen.get(key)
        if target is None:
            target = len(result['positions'])//3
            seen[key] = target
            result['positions'].extend(p)
            result['normals'].extend(n)
            result['uvs'].extend(uv)
        remap.append(target)
    result['indices'] = [remap[i] for i in group['indices']]
    return result


variants = {}
centers = []
letter_stats = {}
for phone in (False, True):
    gold, recess = Geometry(), Geometry()
    segments, sides = (12,5) if phone else (20,8)
    for i in range(48):
        t = at_distance(i*distances[-1]/48)
        center = curve(t)
        tangent = (curve(t+.0001)-curve(t-.0001)).normalized()
        up = Vector((0,1,0))
        up = (up-tangent*up.dot(tangent)).normalized()
        out = tangent.cross(up).normalized()
        phi = math.pi/2 if i%2 else 0.
        minor = up*math.cos(phi)+out*math.sin(phi)
        # 0.48 cm tube radius is 41% thicker than the prior gold accessory.
        link(gold,center,tangent,minor,1.55,.9,.48,segments,sides)
        if not phone:
            centers.append(list(center))
    link(gold,(0,122.9,16.3),(0,1,0),(0,0,1),.8,.7,.32,segments,sides)
    link(gold,(0,121.15,17.05),(0,1,0),(1,0,0),1.3,.72,.34,segments,sides)
    slab(gold,26.4,11.6,1.1,16.6,17.92,.22,116,3 if phone else 6)
    slab(recess,24.7,9.9,.7,17.93,18.055,.045,116,3 if phone else 6)
    variant = 'mobile' if phone else 'desktop'
    letter_stats[variant] = lettering(gold,phone)
    variants[variant] = {'Party_Chain_Gold':compact_group(gold.export()),
                         'Party_Chain_Recess':compact_group(recess.export())}

document = {'version':1, 'units':'centimetres', 'bone':'mixamorig_Spine2',
            'anchors':ANCHORS, 'linkCenters':centers, 'linkCount':48,
            'linkDimensions':{'majorRadius':1.55,'minorRadius':.9,'tubeRadius':.48},
            'pendant':{'word':'Diwali Party','lines':['Diwali','Party'], 'width':26.4,
                       'height':11.6,'centerY':116,'backZ':16.6,'raisedLettering':True},
            'lettering':letter_stats, 'variants':variants}
with gzip.open(os.path.join(OUT,'party-chain-geometry.json.gz'),'wt',encoding='utf-8',compresslevel=9) as f:
    json.dump(document,f,separators=(',',':'))

# Pack the same native Float32 attribute layout used by the reference loader.
with open(os.path.join(ROOT,'dist','glxp','models','Hapes_0003_Rigged.json'),encoding='utf-8') as f:
    rig = json.load(f)
original_skin = next(m for m in rig['meshes'] if m.get('joints'))
nodes = [m for m in rig['meshes'] if m.get('type') == 'Null']
bone = next(n for n in nodes if n['name'] == document['bone'])
joint = next(i for i,j in enumerate(original_skin['joints']) if j['sid'] == bone['sid'])
if len(nodes) != 41 or joint != 15:
    raise RuntimeError('Original Spine2 bind differs from the proven 41-bone rig')
materials = {
    'Party_Chain_Gold':{'albedoColor':'#e9b947','MetalicFactor':1,'RoughnessFactor':.24,'IBL':1},
    'Party_Chain_Recess':{'albedoColor':'#100c08','MetalicFactor':.65,'RoughnessFactor':.46,'IBL':1}}
packed = {}
for variant, groups in variants.items():
    cursor = 0
    chunks, meshes = [], []
    vertices, triangles = 0, 0
    all_bounds = {}
    def pack(values):
        global cursor
        entry = {'type':'Float32Array','length':len(values),'offset':cursor}
        chunks.append(struct.pack('<%sf' % len(values), *values))
        cursor += len(values)
        return entry
    for name, group in groups.items():
        all_bounds[name] = validate_group(name,group)
        n = len(group['positions'])//3
        joint_indices, weights = [0.]*(n*4), [0.]*(n*4)
        for i in range(n):
            joint_indices[i*4], weights[i*4] = joint, 1.
        skin = name+'_Skin'
        meshes.append({'joints':copy.deepcopy(original_skin['joints']),'maxJoints':1,'attribStackNum':1,
                       'ndx_0':pack(joint_indices),'weight_0':pack(weights),
                       'infos':{'name':skin,'type':'Skin','parent':name}})
        meshes.append({'name':name,'type':'triangle','translate':[0,0,0], 'scale':[1,1,1],
                       'rotation':[0,0,0],'parent':None,'material':name,'skin':skin,
                       'vertices':pack(group['positions']),'normal':pack(group['normals']),
                       'uvs':pack(group['uvs']),'indices':pack(group['indices']),
                       'vertexIndex':pack(list(range(n)))})
        vertices += n
        triangles += len(group['indices'])//3
    meshes.extend(copy.deepcopy(nodes))
    binary = b''.join(chunks)
    native = json.dumps({'type':'Mesh data','version':'0.0.1','bufferLength':cursor,'meshes':meshes},separators=(',',':')).encode()
    asset_hash = hashlib.sha256(native+binary).hexdigest()[:10]
    asset_base = 'glxp/models/Party_Chain_'+('Mobile_' if variant == 'mobile' else '')+asset_hash
    with open(os.path.join(ROOT,'dist',asset_base+'.json'),'wb') as f:
        f.write(native)
    with open(os.path.join(ROOT,'dist',asset_base+'.bin'),'wb') as f:
        f.write(binary)
    if len(binary) != cursor*4:
        raise RuntimeError('Native accessory byte count differs from float descriptor')
    packed[variant] = {'assetBase':asset_base,'meshCount':len(groups),'vertices':vertices,
                       'triangles':triangles,'binaryBytes':len(binary),'assetHash':asset_hash,
                       'bounds':all_bounds}
manifest = {'version':1,'name':'Diwali Party thick gold link chain','word':'Diwali Party',
            'bone':document['bone'],'jointIndex':joint,'boneCount':len(nodes),'linkCount':48,
            'linkDimensions':document['linkDimensions'],'pendant':document['pendant'],
            'lettering':letter_stats,'materials':materials,**packed}
with open(os.path.join(OUT,'party-chain-manifest.json'),'w',encoding='utf-8') as f:
    json.dump(manifest,f,indent=2)
    f.write('\n')
# Remove only superseded Party accessory files authored by this builder.
model_directory = os.path.realpath(os.path.join(ROOT,'dist','glxp','models'))
active = {os.path.basename(entry['assetBase']) for entry in packed.values()}
for filename in os.listdir(model_directory):
    if not re.fullmatch(r'Party_Chain_(?:Mobile_)?[a-f0-9]{10}\.(?:json|bin)', filename):
        continue
    if filename.rsplit('.',1)[0] in active:
        continue
    target = os.path.realpath(os.path.join(model_directory,filename))
    if os.path.dirname(target) != model_directory:
        raise RuntimeError('Accessory cleanup leaves the native model directory')
    os.remove(target)
print(json.dumps(manifest),flush=True)


