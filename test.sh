#!/bin/bash

#
# This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
#
# SPDX-FileCopyrightText: 2023 Stanford University
#
# SPDX-License-Identifier: MIT
#

set -e

CONTENT=$(curl --fail http://localhost)
echo "$CONTENT" | grep "Welcome to the Stanford Biodesign Digital Health ENGAGE-HF Web Frontend"

echo "✅ Test Passed!"
