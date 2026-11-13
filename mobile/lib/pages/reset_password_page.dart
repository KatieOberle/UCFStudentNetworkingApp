import 'package:flutter/material.dart';

class ResetPasswordPage extends StatefulWidget {
  final VoidCallback onLoginClick;

  const ResetPasswordPage({
    super.key,
    required this.onLoginClick,
  });

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  String error = '';

  void handleSubmit() {
    setState(() => error = '');

    final password = passwordController.text;
    final confirmPassword = confirmPasswordController.text;

    if (password.length < 8) {
      setState(() => error = 'Password must be at least 8 characters.');
      return;
    }

    if (password != confirmPassword) {
      setState(() => error = 'Passwords do not match.');
      return;
    }

    // TODO: Connect to the backend password-reset API.
    setState(() => error = 'Password reset is not connected to the server yet.');
  }

  @override
  void dispose() {
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Reset Password', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                const Text('Create a new KnightLink password', style: TextStyle(fontSize: 20)),
                const SizedBox(height: 20),
                const Text('Enter your new password below.'),
                const SizedBox(height: 20),
                const Text('New Password'),
                TextField(
                  controller: passwordController,
                  obscureText: true,
                  autofillHints: const [AutofillHints.newPassword],
                  decoration: const InputDecoration(hintText: 'Enter new password'),
                ),
                const SizedBox(height: 8),
                const Text('Password must be at least 8 characters.', style: TextStyle(fontSize: 12)),
                const SizedBox(height: 20),
                const Text('Confirm New Password'),
                TextField(
                  controller: confirmPasswordController,
                  obscureText: true,
                  autofillHints: const [AutofillHints.newPassword],
                  decoration: const InputDecoration(hintText: 'Confirm new password'),
                ),
                if (error.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Text(error, style: const TextStyle(color: Colors.red)),
                ],
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: handleSubmit,
                  child: const Text('Reset Password'),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: widget.onLoginClick,
                  child: const Text('Back to Login'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
