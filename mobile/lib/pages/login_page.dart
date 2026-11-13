import 'package:flutter/material.dart';
import '../main.dart' show postJson, firstNameFromToken, pageLayout, textField, statusMessage;
import 'register_page.dart';
import 'home_page.dart';
import 'forgot_password_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// ---------------------------------------------------------------------------
// Login page: POST /api/auth/login { email, password }
// ---------------------------------------------------------------------------

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _storage = FlutterSecureStorage();
  final _email = TextEditingController();
  final _password = TextEditingController();

  String _message = '';
  bool _loading = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final email = _email.text.trim();
    final password = _password.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() => _message = 'Please enter your email and password.');
      return;
    }

    setState(() {
      _loading = true;
      _message = '';
    });

    try {
      final data = await postJson('/api/auth/login', {
        'email': email,
        'password': password,
      });
      if (!mounted) return;

      // The backend may return HTTP 200 with { error } on login failure.
      final token = data['accessToken'];
          if (token is String && token.isNotEmpty) {
      await _storage.write(key: 'jwt_token', value: token);

      if (!mounted) return;

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => HomePage(token: token),
        ),
      );
      return;
    }

      setState(() {
        _loading = false;
        _message = data['error']?.toString() ?? 'Login failed.';
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _message = 'Could not reach the server. Is the backend running?';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return pageLayout(context, 'Log In', [
      const Text('KnightLink', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
      const Text('UCF Student Networking'),
      const SizedBox(height: 12),
      textField(_email, 'UCF Email'),
      textField(_password, 'Password', obscure: true),
      const SizedBox(height: 4),
      FilledButton(
        onPressed: _loading ? null : _login,
        child: Text(_loading ? 'Logging in...' : 'Log In'),
      ),
      statusMessage(context, _message, true),
      const SizedBox(height: 8),
      TextButton(
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => ForgotPasswordPage(
              onLoginClick: () {
                Navigator.of(context).pop();
              },
            ),
          ),
        ),
        child: const Text('Forgot password?'),
      ),
      TextButton(
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const RegisterPage()),
        ),
        child: const Text("Don't have an account? Sign up"),
      ),
    ]);
  }
}
