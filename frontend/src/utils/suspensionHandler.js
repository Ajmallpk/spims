let setSuspendedGlobal = null;

export function registerSuspensionSetter(fn) {
setSuspendedGlobal = fn;
}

export function triggerSuspension() {
if (setSuspendedGlobal) {
setSuspendedGlobal(true);
}
}
