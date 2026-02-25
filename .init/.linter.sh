#!/bin/bash
cd /home/kavia/workspace/code-generation/classic-tic-tac-toe-228903-228917/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

