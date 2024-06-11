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
echo "$CONTENT" | grep "ENGAGE-HF"

echo "✅ Test Passed!"
