import * as THREE from 'THREE'

export function addFloor(Scene){
	const geom = new THREE.PlaneBufferGeometry( 500, 500, 32 );
	const mat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	const plane = new THREE.Mesh( geom, mat );
	plane.rotation.x = Math.PI/2
	Scene.scene.add( plane );
	return plane
}
