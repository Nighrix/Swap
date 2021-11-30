        
        // Use this to only accept numbers in the swap
        function validateNumber(evt) {
            
            var e = evt || window.event;
            var key = e.keyCode || e.which;
            console.log(e.ctrlKey + "  " + key);

            if ((!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers   
                key >= 48 && key <= 57 ||
                // Numeric keypad
                key >= 96 && key <= 105 ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
                // Home and End
                key == 35 || key == 36 ||
                // left and right arrows
                key == 37 || key == 39 ||
                // Del and Ins
                key == 46 || key == 45 ||
                // Dot and Comma
                key == 190 || key == 188) || (e.ctrlKey && key == 65)) {
                // input is VALID
                
            }
            else {
                // input is INVALID
                e.returnValue = false;
                if (e.preventDefault) e.preventDefault();
            }
        }
        
        
 