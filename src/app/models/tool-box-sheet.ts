class ToolBoxSheet {
    _id: string
    title: string
    numPersonMin: number
    numPersonMax: number
    eventDuration: string
    description: string
    goal: string
    addedValue: string
    steps: Array<string>
    materials: Array<string>

    //constructor 
    constructor(
        _id?: string,
        title?: string,
        numPersonMin?: number,
        numPersonMax?: number,
        eventDuration?: string,
        description?: string,
        goal?: string,
        addedValue?: string,
        steps?: Array<string>,
        materials?: Array<string>) {
        this._id = (_id) ? _id : "";
        this.title = (title) ? title : "";
        this.numPersonMin = (numPersonMin) ? numPersonMin : 0;
        this.numPersonMax = (numPersonMax) ? numPersonMax : 0;
        this.eventDuration = (eventDuration) ? eventDuration : "00:00";
        this.description = (description) ? description : "";
        this.goal = (goal) ? goal : "";
        this.addedValue = (addedValue) ? addedValue : "";
        this.steps = (steps) ? steps : [];
        this.materials = (materials) ? materials : [];
    }
}