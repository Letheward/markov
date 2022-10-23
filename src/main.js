
"use strict"

const print = console.log
const get_node = (id) => document.getElementById(id)
const array_get_random_item = (a) => a[Math.floor(Math.random() * a.length)]

// note: for the same input we may want to keep the Hash Table, but the browser seems to cache it
const get_markov_result = (input, output_length, word_mode = false) => {
    
    if (!input) return ""

    const markov_table = new Map()
    
    if (word_mode) input = input.split(" ")
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
        if (word_mode) output += " "
        state = array_get_random_item(result)
    }

    return output
}




/* ==== Main ==== */

const text_input  = get_node("text_input")
const text_output = get_node("text_output")

let is_word_mode = false

const UI_draw_output = () => {
    let length = parseInt(get_node("output_length").value)
    if (!length) length = 1000
    let result = get_markov_result(text_input.value, length, is_word_mode)   
    text_output.innerText = result ? result : "Cannot generate output, you need to put some text in the input area!" 
}

get_node("generate").onclick = UI_draw_output

get_node("is_word_mode").onclick = () => {

    if (is_word_mode) is_word_mode = false    
    else              is_word_mode = true
    
    get_node("is_word_mode").textContent = "Mode: " + (is_word_mode ? "Word" : "Unicode")
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

