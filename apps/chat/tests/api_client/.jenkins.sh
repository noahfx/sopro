npm start &

newman -c tests/api_client/collections/collection.json --testReportFile tests/api_client/test-out.xml

pkill node