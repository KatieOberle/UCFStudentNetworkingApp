import 'package:flutter/material.dart';
import '../main.dart' show postJson;

class ForgotPasswordPage extends StatefulWidget {
  final VoidCallback onLoginClick;

  const ForgotPasswordPage({super.key, required this.onLoginClick});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  String message = '';
  bool loading = false;
  bool isError = true;

    Future<void> handleSubmit() async {
    final email = emailController.text.trim();
    final emailRegex = RegExp(r'^[^\s@]+@ucf\.edu$', caseSensitive: false);

    if (!emailRegex.hasMatch(email)) {
      setState(() {
        message = 'Please enter a valid @ucf.edu email address.';
        isError = true;
      });
      return;
    }

    setState(() {
      loading = true;
      message = '';
    });

    try {
      final data = await postJson('/api/auth/forgot-password', {
        'email': email,
      });

      if (!mounted) return;

      final error = data['error']?.toString() ?? '';

      setState(() {
        loading = false;
        isError = error.isNotEmpty;
        message = error.isNotEmpty
            ? error
            : 'If an account exists for this email, a password reset link will be sent.';
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        loading = false;
        isError = true;
        message = 'Could not reach the server. Please try again.';
      });
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF561787),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Container(
            width: double.infinity,
            constraints: const BoxConstraints(maxWidth: 420),
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: const Color(0xFF17121F),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF34233F)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Forgot Password?',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Reset your KnightLink password',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white70, fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Enter your UCF email address to request a password reset link.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white70, fontSize: 15),
                ),
                const SizedBox(height: 24),
                const Text(
                  'UCF Email',
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  autofillHints: const [AutofillHints.email],
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'name@ucf.edu',
                    hintStyle: const TextStyle(color: Colors.white54),
                    filled: true,
                    fillColor: const Color(0xFF241A2E),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
                if (message.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Text(
                    message,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: isError ? Colors.redAccent : Colors.greenAccent,
                      fontSize: 14,
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: loading ? null : handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF561787),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: Text(
                    loading ? 'Sending...' : 'Request Password Reset',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
                const SizedBox(height: 24),
                Wrap(
                  alignment: WrapAlignment.center,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    const Text('Remember your password?', style: TextStyle(color: Colors.white70)),
                    TextButton(
                      onPressed: widget.onLoginClick,
                      child: const Text('Back to Login', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
