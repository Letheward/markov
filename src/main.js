
"use strict"

const print = console.log
const get_node = (id) => document.getElementById(id)
const array_get_random_item = (a) => a[Math.floor(Math.random() * a.length)]

// note: for the same input we may want to keep the Hash Table, but the browser seems to cache it
const get_markov_result = (input, output_length, break_by_space = false) => {

    const markov_table = new Map()
    
    if (break_by_space) input = input.split(" ")
    for (let i = 0; i < input.length; i++) {
        markov_table.set(input[i], []) // todo: we did not handle unicode fully, like multi-codepoint pairs
    }

    for (let i = 0; i < input.length - 1; i++) {
        let item = markov_table.get(input[i])
        item.push(input[i + 1])
    }

    const keys = Array.from(markov_table.keys())
    let state = array_get_random_item(keys)

    let output = ""
    for (let i = 0; i < output_length; i++) {

        let result = markov_table.get(state)
        if (!result) {
            state = array_get_random_item(keys)
            continue
        }
        
        output += state
        if (break_by_space) output += " "
        state = array_get_random_item(result)
    }

    return output
}




/* ==== Main ==== */

const input  = get_node("text_input")
const output = get_node("text_output")
let break_by_space = false

const UI_draw_output = () => {
    let length = parseInt(get_node("output_length").value)
    if (!length) length = 1000
    output.innerText = get_markov_result(input.value, length, break_by_space)   
}

get_node("break_by_space").onclick = () => {

    if (break_by_space) break_by_space = false    
    else                break_by_space = true
    
    get_node("break_by_space").textContent = "Mode: " + (break_by_space ? "Word" : "Unicode")
}

get_node("generate").onclick = () => {
    UI_draw_output()
}

document.onkeydown = (e) => {

    // todo: nodeName or localName? 
    switch (e.target.nodeName) {
        case "INPUT": case "TEXTAREA": return
        default: break
    } 

    switch (e.key) {    
        case "Enter": case " ": {
            e.preventDefault()
            UI_draw_output()
            break
        }
        default: break
    }
}

