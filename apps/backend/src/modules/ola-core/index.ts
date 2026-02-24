import OlaCoreService from "./service"
import { Module } from "@medusajs/framework/utils"

export const OLA_CORE_MODULE = "olaCore"

export default Module(OLA_CORE_MODULE, {
    service: OlaCoreService,
})
