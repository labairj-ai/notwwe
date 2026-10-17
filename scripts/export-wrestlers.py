"""Export original Harbor Circuit wrestlers. Blender 4.5.4 + MPFB 2.0.18.
See assets/README.md for pinned sources, CC0 provenance and regeneration.
"""
import os, sys, math, json
from pathlib import Path
import bpy
import numpy as np
from mathutils import Vector, Quaternion
source=Path(os.environ.get('MPFB_SOURCE','/tmp/notsims-art/mpfb2/src'))
assets=Path(os.environ.get('MPFB_ASSETS','/tmp/notsims-art/assets'))
out=Path(os.environ.get('CHARACTER_OUT','/tmp/notwwe-art'));out.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(source))
original=bpy.utils.extension_path_user
def extension_path(package,*a,**kw):
    if package=='mpfb':
        p=out/'mpfb-user';p.mkdir(exist_ok=True);return str(p)
    return original(package,*a,**kw)
bpy.utils.extension_path_user=extension_path
import mpfb
mpfb.bl_info=mpfb.fake_bl_info
bpy.ops.preferences.addon_enable(module='mpfb')
from mpfb.services.humanservice import HumanService
from mpfb.services.targetservice import TargetService
from mpfb.entities.objectproperties import HumanObjectProperties
assert bpy.app.version[:3]==(4,5,4)
def material(name,color,image=None,alpha=False):
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*color,1);b.inputs['Roughness'].default_value=.68
    if image:
        img=bpy.data.images.load(str(image),check_existing=True)
        if max(img.size)>1024:img.scale(1024,1024)
        t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=img;m.node_tree.links.new(t.outputs['Color'],b.inputs['Base Color'])
        if alpha:m.node_tree.links.new(t.outputs['Alpha'],b.inputs['Alpha']);m.surface_render_method='DITHERED'
    return m
# Grayscale tintable skin preserves source detail without copying a resident identity.
img=bpy.data.images.load(str(assets/'skins/young_caucasian_male/young_lightskinned_male_diffuse.png'));img.scale(1024,1024)
p=np.array(img.pixels[:],dtype=np.float32).reshape(-1,4);p[:,:3]=np.clip(p[:,:3].mean(axis=1)*1.6,0,1)[:,None];img.pixels.foreach_set(p.ravel());img.filepath_raw=str(out/'skin-neutral.png');img.file_format='PNG';img.save()
DURATIONS={'Idle':3,'CombatIdle':2,'Walk':1,'Run':.7,'GrappleIdle':2,'Stunned':1,'KnockdownFront':.8,'KnockdownBack':.8,'Grounded':2,'GetUpFront':1.4,'GetUpBack':1.4,'Taunt':2,'PinControl':2,'PinEscape':1,'SubmissionControl':2,'SubmissionDefense':2,'Victory':3,'Defeat':3,'StrikeActor':.85,'StrikeReceiver':.85,'KickActor':.9,'RunningActor':1.1,'GrappleActor':1,'GrappleReceiver':1,'SlamActor':2.2,'SlamReceiver':2.2,'SuplexActor':2.4,'SuplexReceiver':2.4,'ThrowActor':1.8,'ThrowReceiver':1.8,'GroundStrikeActor':1,'GroundStrikeReceiver':1,'CounterActor':1.1,'CounterReceiver':1.1,'SignatureActor':2.6,'SignatureReceiver':2.6,'FinisherActor':3,'FinisherReceiver':3}
LOOPS={'Idle','CombatIdle','Walk','Run','GrappleIdle','Grounded','Stunned','PinControl','SubmissionControl','SubmissionDefense','Victory','Defeat'}
I=Quaternion()
def turn(axis,a):return Quaternion(Vector(axis),a)
def pose(rig,mode,t):
    cycle=math.sin(t*math.tau);env=math.sin(math.pi*t)**2;desired={};pitch=0;rise=0
    down=mode in {'Grounded','Defeat','SubmissionDefense','GroundStrikeReceiver'}
    if down:pitch=math.pi/2;rise=.17
    if mode.startswith('Knockdown'):pitch=math.pi/2*min(1,t*1.3);rise=.17*min(1,t*1.3)
    if mode.startswith('GetUp'):pitch=math.pi/2*(1-t);rise=.17*(1-t)
    if mode in {'PinControl','SubmissionControl'}:pitch=.65;rise=.1
    if mode.endswith('Receiver') and mode.startswith(('Slam','Suplex','Signature','Finisher','Throw')):
        # Lift then land; root returns to grounded semantic pose, never MatchState.
        q=max(0,min(1,(t-.2)/.65));pitch=(math.pi*1.5 if mode.startswith('Suplex') else math.pi/2)*q
        if mode.startswith('Suplex'):pitch=math.pi*t/.55 if t<=.55 else math.pi-math.pi/2*(t-.55)/.45
        rise=max(math.sin(math.pi*min(1,t/.85))*1.05+.17*t,-math.cos(pitch)*1.9+.18)
        if mode.startswith('Suplex'):rise+=.9*env
    if mode in {'GrappleActor','GrappleReceiver','GrappleIdle'}:desired['spine_03']=turn((1,0,0),.1)
    for side,sign in [('l',1),('r',-1)]:
        av=Vector((sign*.15,-.12,-1));fv=Vector((sign*.03,-.15,-1))
        if mode in {'CombatIdle','GrappleIdle','GrappleActor','GrappleReceiver','Stunned'}:av=Vector((sign*.3,-.35,-.75));fv=Vector((-sign*.15,-.35,.7))
        if mode in {'Walk','Run'}:
            swing=cycle*sign*(.5 if mode=='Walk' else .9);av=turn((1,0,0),-swing*.75)@av;fv=turn((1,0,0),-swing*.5)@fv
        if mode in {'Taunt','Victory'}:av=Vector((sign*.6,0,.7));fv=Vector((sign*.2,0,1))
        if mode in {'StrikeActor','RunningActor','CounterActor'}:
            av=av.lerp(Vector((sign*.18,-1,.05)),env);fv=fv.lerp(Vector((0,-1,.05)),env)
        if mode in {'StrikeReceiver','CounterReceiver'}:desired['spine_03']=turn((1,0,0),-.25*env)
        if mode in {'PinControl','SubmissionControl'}:av=Vector((sign*.3,-.7,-.4));fv=Vector((0,-1,-.2))
        if mode.startswith(('Slam','Suplex','Signature','Finisher')) and mode.endswith('Actor'):
            lift=math.sin(math.pi*t);av=av.lerp(Vector((sign*.25,-.7,.6)),lift);fv=fv.lerp(Vector((0,-.5,1)),lift);desired['spine_03']=turn((1,0,0),-.25*env)
        if mode=='ThrowActor':av=av.lerp(Vector((sign*.25,-1,0)),env);fv=fv.lerp(Vector((0,-1,0)),env)
        if down or mode=='PinEscape':av=Vector((sign*.5,-.1,-.6));fv=Vector((sign*.4,-.3,-.5))
        for name,vec in [('upperarm_'+side,av),('lowerarm_'+side,fv)]:
            b=rig.pose.bones[name];rest=b.bone.tail_local-b.bone.head_local;desired[name]=rest.normalized().rotation_difference(vec.normalized())
        for name in ['thigh_'+side,'calf_'+side]:
            b=rig.pose.bones[name];rest=b.bone.tail_local-b.bone.head_local;angle=0
            if mode in {'Walk','Run'}:angle=cycle*sign*(.48 if mode=='Walk' else .85)+(max(0,-math.cos(t*math.tau+(0 if side=='l' else math.pi)))*.7 if name.startswith('calf') else 0)
            if mode in {'KickActor','GroundStrikeActor'} and side=='r':angle=-.95*env if name.startswith('thigh') else .3*env
            if mode in {'GetUpFront','GetUpBack','PinControl','SubmissionControl'}:angle=(-.7 if name.startswith('thigh') else 1.1)*(1-t if mode.startswith('GetUp') else 1)
            desired[name]=turn((1,0,0),angle)
    if mode=='Idle':desired['spine_03']=turn((1,0,0),cycle*.012)
    if mode=='Stunned':desired['head']=turn((1,0,0),.2)
    global_q=turn((1,0,0),pitch);applied={}
    for b in rig.pose.bones:
        parent=applied.get(b.parent.name,I) if b.parent else I
        delta=global_q@desired.get(b.name,I) if b.name in desired or not b.parent else parent
        rest=b.bone.matrix_local.to_quaternion();b.rotation_mode='QUATERNION';b.rotation_quaternion=rest.inverted()@parent.inverted()@delta@rest;b.location=(0,0,0);applied[b.name]=delta
        if not b.parent:b.location=rest.inverted()@Vector((0,0,rise))
metadata={'generator':'Blender 4.5.4 / MPFB 2.0.18','fps':24,'license':'CC0-1.0','clips':[{'name':n,'duration':round(d*24)/24,'loop':n in LOOPS} for n,d in DURATIONS.items()],'models':[]}
for profile,gender,muscle,weight in [('athletic',.75,.75,.5),('powerhouse',.85,1,.75),('women_athletic',0,.75,.5)]:
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    body=HumanService.create_human();body.name='Circuit_Body'
    for key,value in [('gender',gender),('muscle',muscle),('weight',weight)]:HumanObjectProperties.set_value(key,value,entity_reference=body)
    TargetService.reapply_macro_details(body)
    rig=HumanService.add_builtin_rig(body,'game_engine');rig.name='Circuit_Humanoid'
    skin=material('Circuit_Skin',(1,1,1),out/'skin-neutral.png');gear=material('Circuit_Gear',(.8,.8,.8));trim=material('Circuit_Trim',(.11,.13,.16));boots=material('Circuit_Boots',(.12,.13,.15))
    body.data.materials.clear()
    for mat in [skin,gear,trim,boots]:body.data.materials.append(mat)
    # Mesh material regions form opaque wrestling trunks/singlet, boots and pads.
    # Smooth anatomical silhouette comes from the CC0 human, not geometric blocks.
    def asset(sub,name,label,kind):
        obj=HumanService.add_mhclo_asset(str(assets/sub/name/(name+'.mhclo')),body,asset_type=kind,subdiv_levels=0);obj.name=label;return obj
    eyes=asset('eyes','low-poly','Circuit_Eyes','Eyes');eyes.data.materials.clear();eyes.data.materials.append(material('Circuit_Eyes',(1,1,1),assets/'eyes/materials/brown_eye.png'))
    for poly in eyes.data.polygons:poly.material_index=0
    shoes=asset('clothes','shoes03','Circuit_BootsMesh','Clothes');shoes.data.materials.clear();shoes.data.materials.append(boots)
    for style,name in [('short','short01'),('long','long01'),('curly','afro01')]:
        hair=asset('hair',name,'Circuit_Hair_'+style,'Hair');diffuse=None
        for line in (assets/'hair'/name/(name+'.mhmat')).read_text().splitlines():
            if line.startswith('diffuseTexture '):diffuse=assets/'hair'/name/line.split(maxsplit=1)[1].strip()
        hair.data.materials.clear();hair.data.materials.append(material('Circuit_Hair_'+style,(1,1,1),diffuse,True))
    for obj in [o for o in bpy.context.scene.objects if o.type=='MESH']:
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
        if obj.data.shape_keys:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
        for mod in list(obj.modifiers):
            if mod.type=='ARMATURE':continue
            if mod.type=='SUBSURF':obj.modifiers.remove(mod)
            else:bpy.ops.object.modifier_apply(modifier=mod.name)
        for poly in obj.data.polygons:poly.use_smooth=True
    for poly in body.data.polygons:
        pos=sum((body.data.vertices[i].co for i in poly.vertices),Vector())/len(poly.vertices);z=pos.z
        poly.material_index=1 if .67<z<1.0 and abs(pos.x)<.29 or profile=='women_athletic' and .95<z<1.38 and abs(pos.x)<.32 else 3 if z<.3 else 2 if .43<z<.56 else 0
    # Only athletic carries the shared motion library; other bodies retarget it.
    if profile=='athletic':
        rig.animation_data_create()
        for name,duration in DURATIONS.items():
            count=round(duration*24);action=bpy.data.actions.new(name);rig.animation_data.action=action
            for i in range(count+1):
                pose(rig,name,i/count)
                for b in rig.pose.bones:
                    b.keyframe_insert('rotation_quaternion',frame=i,group=b.name)
                    if not b.parent:b.keyframe_insert('location',frame=i,group=b.name)
            track=rig.animation_data.nla_tracks.new();track.name=name;track.strips.new(name,0,action);track.mute=True
        rig.animation_data.action=None
    pose(rig,'Idle',0);bpy.context.scene.render.fps=24;bpy.context.scene.frame_set(0)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/(profile+'.blend')))
    path=out/(profile+'.glb');bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',export_animations=profile=='athletic',export_animation_mode='ACTIONS',export_force_sampling=True,export_skins=True,export_morph=False,export_yup=True,export_apply=False)
    assert path.stat().st_size<8_000_000
    metadata['models'].append({'id':profile,'file':path.name,'bytes':path.stat().st_size,'bones':len(rig.pose.bones)})
(out/'metadata.json').write_text(json.dumps(metadata,indent=2)+'\n');print('EXPORTED',json.dumps(metadata['models']),flush=True)
