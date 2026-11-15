import 'dart:convert';
import 'package:http/http.dart' as http;

const String apiBase = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:5000',
);

Future<Map<String, dynamic>> postJson(
  String path,
  Map<String, String> body,
) async {
  final response = await http.post(
    Uri.parse('$apiBase$path'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );
  return jsonDecode(response.body) as Map<String, dynamic>;
}

String firstNameFromToken(String token) {
  try {
    final payload = token.split('.')[1];
    final decoded = utf8.decode(base64Url.decode(base64Url.normalize(payload)));
    final data = jsonDecode(decoded) as Map<String, dynamic>;
    return data['firstName']?.toString() ?? '';
  } catch (_) {
    return '';
  }
}
