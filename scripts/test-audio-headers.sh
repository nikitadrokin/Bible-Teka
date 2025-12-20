#!/bin/bash

# Test script to compare Content-Range headers between 4bbl.ru and your proxy
# Usage: ./test-audio-headers.sh [your-domain]
# Example: ./test-audio-headers.sh bibleteka.nkdr.me

DOMAIN="${1:-bibleteka.nkdr.me}"
BOOK="01"
CHAPTER="01"

echo "=============================================="
echo "Audio Header Comparison Test"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing: Book ${BOOK}, Chapter ${CHAPTER}${NC}"
echo ""

# Test 1: 4bbl.ru direct (no Range header)
echo "----------------------------------------------"
echo -e "${YELLOW}1. 4bbl.ru Direct - Full Request (no Range)${NC}"
echo "----------------------------------------------"
curl -sI "https://4bbl.ru/data/syn-kozlov/${BOOK}/${CHAPTER}.mp3" | grep -iE "^(HTTP|content-length|content-range|accept-ranges|content-type):"
echo ""

# Test 2: 4bbl.ru direct (with Range header)
echo "----------------------------------------------"
echo -e "${YELLOW}2. 4bbl.ru Direct - Range Request (bytes=0-1000)${NC}"
echo "----------------------------------------------"
curl -sI -H "Range: bytes=0-1000" "https://4bbl.ru/data/syn-kozlov/${BOOK}/${CHAPTER}.mp3" | grep -iE "^(HTTP|content-length|content-range|accept-ranges|content-type):"
echo ""

# Test 3: Your proxy (no Range header)
echo "----------------------------------------------"
echo -e "${YELLOW}3. Your Proxy - Full Request (no Range)${NC}"
echo "----------------------------------------------"
curl -sI "https://${DOMAIN}/api/audio/${BOOK}/${CHAPTER}.mp3" | grep -iE "^(HTTP|content-length|content-range|accept-ranges|content-type|vary|cf-cache-status):"
echo ""

# Test 4: Your proxy (with Range header)
echo "----------------------------------------------"
echo -e "${YELLOW}4. Your Proxy - Range Request (bytes=0-1000)${NC}"
echo "----------------------------------------------"
curl -sI -H "Range: bytes=0-1000" "https://${DOMAIN}/api/audio/${BOOK}/${CHAPTER}.mp3" | grep -iE "^(HTTP|content-length|content-range|accept-ranges|content-type|vary|cf-cache-status):"
echo ""

# Test 5: Your proxy (with Range header - middle of file)
echo "----------------------------------------------"
echo -e "${YELLOW}5. Your Proxy - Range Request (bytes=10000-20000)${NC}"
echo "----------------------------------------------"
curl -sI -H "Range: bytes=10000-20000" "https://${DOMAIN}/api/audio/${BOOK}/${CHAPTER}.mp3" | grep -iE "^(HTTP|content-length|content-range|accept-ranges|content-type|vary|cf-cache-status):"
echo ""

echo "=============================================="
echo -e "${GREEN}Test Complete!${NC}"
echo "=============================================="
echo ""
echo "What to look for:"
echo "  ✓ Status should be 206 for Range requests"
echo "  ✓ Content-Range should show 'bytes X-Y/TOTAL'"
echo "  ✓ Content-Length should match the requested range size"
echo "  ✓ Vary: Range header should be present (for Cloudflare)"
echo ""
echo "If Cf-Cache-Status is 'HIT' and headers are wrong,"
echo "try purging Cloudflare cache for /api/audio/* routes."
