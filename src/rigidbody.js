import { Component } from "ape-ecs";
import { Vector3, Matrix3, BufferGeometry, BoxGeometry } from "three";
import { EPSILON } from "./utils";

class RigidBody extends Component {
    totalForce          = new Vector3();
    totalTorque         = new Vector3();
    centerOfMass        = new Vector3();
    inertiaTensor       = new Matrix3();
    initialInertiaTensor= new Matrix3();
    invInertia          = new Matrix3();
    initialInvInertia   = new Matrix3();
    velocity            = new Vector3();
    angularVelocity     = new Vector3();
    density             = 0;
    volume              = 0;


    static properties = {
        geometry: new BoxGeometry(),
        position: undefined,
        rotation: undefined,
        mass: 0,
        isKinematic: true,
        affectedByGravity: true,
        drag: 0,
        angularDrag: 0
    }


    get inertiaTensor(){
        return this.invInertia.clone().invert()
    }

    addForce(force) {
        if (force.length() < EPSILON) {
            return
        }
        this.totalForce.add(force);

    }
    /**
     * 
     * @param {Vector3} force 
     * @param {Vector3} position 
     * @returns 
     */
    addForceAtPosition(force, position) {
        if (force.length() < EPSILON)
            return
        this.totalForce.add(force);
        let arm = position.clone().sub(this.position.clone());
        let torque = new Vector3().crossVectors(arm, force)
        if (torque.length() < EPSILON)
            return
        this.totalTorque.add(torque);
    }
    addTorqueFromForce(force, position) {
        if (force.length() < EPSILON)
            return
        let arm = position.clone().sub(this.position.clone());
        let torque = new Vector3().crossVectors(arm, force)
        if (torque.length() < EPSILON)
            return
        this.totalTorque.add(torque);
    }
    addTorque(torque){
        if(torque.length() < EPSILON)
            return
        this.totalTorque.add(torque);
    }
}

export default RigidBody;