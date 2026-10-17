"""Offline source-asset QA only; not a browser/physical-device certification.
Blender 4.5.4 --background --python scripts/preview-wrestlers.py
CHARACTER_OUT selects exported .blend directory; PREVIEW_MODE=paired selects suplex phases.
"""
import bpy, math, os
from pathlib import Path
from mathutils import Vector
out=Path(os.environ.get('CHARACTER_OUT','/tmp/notwwe-art'))
def tint(m,color):
 if not m.use_nodes:return
 b=m.node_tree.nodes.get('Principled BSDF');socket=b.inputs['Base Color']
 if socket.links:
  old=socket.links[0].from_socket
  mix=m.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=(*color,1)
  m.node_tree.links.new(old,mix.inputs[1]);m.node_tree.links.new(mix.outputs[0],socket)
 else:socket.default_value=(*color,1)
if os.environ.get('PREVIEW_MODE')=='paired':
 for phase in [.2,.45,.65,.9]:
  bpy.ops.wm.open_mainfile(filepath=str(out/'athletic.blend'))
  source=[o for o in bpy.context.scene.objects if o.type in {'MESH','ARMATURE'}]
  rig=next(o for o in source if o.type=='ARMATURE')
  for o in source:
   if o.name.startswith('Circuit_Hair_') and not o.name.endswith('short'):o.hide_render=True
  bpy.ops.object.select_all(action='DESELECT')
  for o in source:o.select_set(True)
  bpy.context.view_layer.objects.active=rig;bpy.ops.object.duplicate(linked=False)
  copies=list(bpy.context.selected_objects);receiver=next(o for o in copies if o.type=='ARMATURE')
  rig.location.y=.38;receiver.location.y=-.38;receiver.rotation_euler.z=math.pi
  for actor,name in [(rig,'SuplexActor'),(receiver,'SuplexReceiver')]:
   action=bpy.data.actions[name];actor.animation_data.action=action;actor.animation_data.action_slot=action.slots[0]
  for objects,skin,gear in [(source,(.65,.4,.24),(.8,.3,.1)),(copies,(.8,.6,.4),(.05,.4,.4))]:
   for obj in objects:
    if obj.type!='MESH':continue
    for slot in obj.material_slots:
     slot.material=slot.material.copy()
     if slot.material.name.startswith('Circuit_Skin'):tint(slot.material,skin)
     if slot.material.name.startswith('Circuit_Gear'):tint(slot.material,gear)
  bpy.context.scene.frame_set(round(phase*58))
  bpy.ops.mesh.primitive_plane_add(size=200);floor=bpy.context.object;floor.location.z=-.03
  mat=bpy.data.materials.new('Mat');mat.diffuse_color=(.13,.22,.23,1);floor.data.materials.append(mat)
  bpy.ops.object.camera_add(location=(4,-6,3));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=4.1;bpy.context.scene.camera=cam
  for pos,power in [((2,-4,5),1000),((-3,0,4),700)]:
   bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.data.energy=power;o.data.size=4;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
  s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=20;s.render.resolution_x=640;s.render.resolution_y=640;s.render.resolution_percentage=100;s.world.color=(.2,.2,.2);s.render.filepath=str(out/f'qa-suplex-{phase}.png');bpy.ops.render.render(write_still=True)
else:
 for profile in ['athletic','powerhouse','women_athletic']:
  bpy.ops.wm.open_mainfile(filepath=str(out/(profile+'.blend')))
  for o in list(bpy.context.scene.objects):
   if o.name.startswith('Circuit_Hair_') and not o.name.endswith('short' if profile!='women_athletic' else 'long'):o.hide_render=True
  for m in bpy.data.materials:
   if m.name.startswith('Circuit_Skin'):tint(m,(.65,.4,.24))
   if m.name.startswith('Circuit_Gear'):tint(m,(.05,.35,.4))
  bpy.ops.mesh.primitive_plane_add(size=200);floor=bpy.context.object;floor.location.z=-.03
  mat=bpy.data.materials.new('Floor');mat.diffuse_color=(.15,.2,.22,1);floor.data.materials.append(mat)
  bpy.ops.object.camera_add(location=(3,-6,2.5));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.95))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=2.8;bpy.context.scene.camera=cam
  for pos,power,size in [((2,-4,5),800,4),((-3,-1,3),500,3),((0,3,4),600,3)]:
   bpy.ops.object.light_add(type='AREA',location=pos);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
  scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.render.resolution_x=640;scene.render.resolution_y=640;scene.render.resolution_percentage=100;scene.world.color=(.15,.15,.15);scene.render.filepath=str(out/('qa-'+profile+'.png'));bpy.ops.render.render(write_still=True)
